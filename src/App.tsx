import React, { useState, useMemo, useRef, useEffect } from 'react';
import { supabase } from './lib/supabase'
import { 
  Search, Filter, Eye, Globe, Mail, Plus, MapPin, Users, TrendingUp, 
  Building, Phone, Star, ArrowUpDown, Download, BarChart3, PieChart,
  Target, Zap, ExternalLink, X, CheckCircle, AlertCircle,
  Calendar, DollarSign, Briefcase, Map, Database, Settings, Home
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';

// TUTAJ WKLEJ POZOSTAŁE DANE

const [companies, setCompanies] = useState<any[]>([]);
const [loadingCompanies, setLoadingCompanies] = useState(true);

useEffect(() => {
  let mounted = true;
  (async () => {
    setLoadingCompanies(true);
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true });
    if (!mounted) return;
    if (!error && data) setCompanies(data);
    setLoadingCompanies(false);
  })();
  return () => { mounted = false; };
}, []);

const CRMApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedPotential, setSelectedPotential] = useState('');
  const [selectedModal, setSelectedModal] = useState(null);
  const [reportCompanies, setReportCompanies] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [mapView, setMapView] = useState<{ center: [number, number]; zoom: number }>({
    center: [52.1, 19.4], // środek PL
    zoom: 6
  });
  // Filtry i dane
  const regions = [...new Set(companies.map(c => c.region))].filter(Boolean);
  const industries = [...new Set(companies.map(c => c.industry))].filter(Boolean);

  const filteredCompanies = useMemo(() => {
    let filtered = companies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRegion = !selectedRegion || company.region === selectedRegion;
      const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry;
      const matchesPotential = !selectedPotential || company.potential === selectedPotential;
      
      return matchesSearch && matchesRegion && matchesIndustry && matchesPotential;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';
        
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        
        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [searchTerm, selectedRegion, selectedIndustry, selectedPotential, sortField, sortDirection]);

  const clients = filteredCompanies.filter(c => c.type === 'klient');
  const partners = filteredCompanies.filter(c => c.type === 'partner');

  // Statystyki dla dashboard
  const stats = {
    totalClients: companies.filter(c => c.type === 'klient').length,
    totalPartners: companies.filter(c => c.type === 'partner').length,
    highPotential: companies.filter(c => c.potential === 'wysoki').length,
    regionsData: regions.map(region => ({
      region,
      count: companies.filter(c => c.region === region).length
    })),
    industriesData: industries.slice(0, 5).map(industry => ({
      industry,
      count: companies.filter(c => c.industry === industry).length
    })),
    potentialData: [
      { name: 'Wysoki', value: companies.filter(c => c.potential === 'wysoki').length, color: '#10b981' },
      { name: 'Średni', value: companies.filter(c => c.potential === 'średni').length, color: '#f59e0b' },
      { name: 'Niski', value: companies.filter(c => c.potential === 'niski').length, color: '#ef4444' }
    ]
  };

  const getPotentialBadge = (potential) => {
    const colors = {
      'wysoki': 'bg-gradient-to-r from-green-500 to-emerald-600',
      'średni': 'bg-gradient-to-r from-yellow-500 to-orange-600', 
      'niski': 'bg-gradient-to-r from-red-500 to-rose-600'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${colors[potential] || 'bg-gray-500'}`}>
        {potential || 'brak'}
      </span>
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const addToReport = (company) => {
    if (!reportCompanies.find(c => c.id === company.id)) {
      setReportCompanies([...reportCompanies, company]);
    }
  };

  const removeFromReport = (companyId) => {
    setReportCompanies(reportCompanies.filter(c => c.id !== companyId));
  };

  const generateEmail = (company) => {
    const subject = `Współpraca - ${company.name}`;
    const body = `Dzień dobry,\n\nPiszę w sprawie potencjalnej współpracy w zakresie filtrów przemysłowych.\n\nPozdrawiam`;
    window.open(`mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  // Komponenty
  const Navigation = () => (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FiltersPro CRM
            </h1>
          </div>
          
          <div className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'clients', label: 'Klienci', icon: Building },
              { id: 'partners', label: 'Partnerzy', icon: Users },
              { id: 'map', label: 'Mapa', icon: Map },
              { id: 'strategy', label: 'Strategia', icon: Target }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>

         <div className="flex items-center space-x-2">
  {reportCompanies.length > 0 && (
    <>
      <span className="text-sm text-gray-300">Raport: {reportCompanies.length}</span>
      <button className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm hover:shadow-lg transition-all duration-200">
        <Download className="w-4 h-4" />
      </button>
      <span className="w-px h-5 bg-gray-700 mx-2" />
    </>
  )}

  <button
    onClick={async () => {
      await supabase.auth.signOut()
      window.location.href = '/login'
    }}
    className="px-3 py-1 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
  >
    Wyloguj
  </button>
</div>

        </div>
      </div>
    </nav>
  );

  const CompanyModal = ({ company, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{company.name}</h2>
            <div className="flex items-center space-x-3">
              {getPotentialBadge(company.potential)}
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                company.type === 'klient' 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              }`}>
                {company.type === 'klient' ? 'Klient' : 'Partner'}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Lokalizacja</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>{company.city}, {company.region}</span>
                  </div>
                  {company.address && (
                    <p className="text-sm text-gray-400 pl-6">{company.address}</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Branża</h3>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm border border-indigo-500/30">
                  {company.industry}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {company.employees && (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Pracownicy</h3>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-400" />
                    <span className="text-white">{company.employees}</span>
                  </div>
                </div>
              )}

              {company.revenue && (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Przychody</h3>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                    <span className="text-white">{company.revenue}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {company.description && (
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Opis</h3>
              <p className="text-gray-300 leading-relaxed">{company.description}</p>
            </div>
          )}

          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Kontakt</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {company.phone && (
                <a href={`tel:${company.phone}`} className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Zadzwoń</span>
                </a>
              )}
              {company.email && (
                <button onClick={() => generateEmail(company)} className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </button>
              )}
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">Strona</span>
                </a>
              )}
            </div>
          </div>

          <button 
            onClick={() => addToReport(company)}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Dodaj do raportu</span>
          </button>
        </div>
      </div>
    </div>
  );

  const FiltersBar = () => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Szukaj firm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">Wszystkie regiony</option>
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>

        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">Wszystkie branże</option>
          {industries.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>

        <select
          value={selectedPotential}
          onChange={(e) => setSelectedPotential(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">Wszystkie potencjały</option>
          <option value="wysoki">Wysoki</option>
          <option value="średni">Średni</option>
          <option value="niski">Niski</option>
        </select>

        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filtruj</span>
        </button>
      </div>
    </div>
  );

  const CompanyTable = ({ companies, title }) => (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">{title} ({companies.length})</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Akcje</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center space-x-1">
                  <span>Firma</span>
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('industry')}>
                <div className="flex items-center space-x-1">
                  <span>Branża</span>
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Lokalizacja</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Wielkość</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('potential')}>
                <div className="flex items-center space-x-1">
                  <span>Potencjał</span>
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Telefon</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Działania</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={company.id} className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${index % 2 === 0 ? 'bg-gray-800/20' : ''}`}>
                <td className="px-4 py-3">
                  <button
                    onClick={() => addToReport(company)}
                    className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                    title="Dodaj do raportu"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-white">{company.name}</div>
                  <div className="text-sm text-gray-400">{company.city}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs border border-indigo-500/30">
                    {company.industry}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300">
                  <div>{company.city}</div>
                  <div className="text-sm text-gray-400">{company.region}</div>
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {company.employees || 'brak danych'}
                </td>
                <td className="px-4 py-3">
                  {getPotentialBadge(company.potential)}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {company.email || '-'}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {company.phone || '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedModal(company)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      title="Zobacz szczegóły"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        title="Otwórz stronę"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    {company.email && (
                      <button
                        onClick={() => generateEmail(company)}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        title="Wyślij email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Główne widoki
  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Klienci</p>
              <p className="text-3xl font-bold">{stats.totalClients}</p>
            </div>
            <Building className="w-10 h-10 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Partnerzy</p>
              <p className="text-3xl font-bold">{stats.totalPartners}</p>
            </div>
            <Users className="w-10 h-10 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Wysoki potencjał</p>
              <p className="text-3xl font-bold">{stats.highPotential}</p>
            </div>
            <Star className="w-10 h-10 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">W raporcie</p>
              <p className="text-3xl font-bold">{reportCompanies.length}</p>
            </div>
            <Database className="w-10 h-10 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Firmy według regionów</h3>
          <ResponsiveContainer width="100%" height={300}>
           <BarChart data={stats.regionsData}>
  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
  <XAxis dataKey="region" stroke="#9CA3AF" />
  <YAxis stroke="#9CA3AF" />
 <RechartsTooltip
  contentStyle={{
    backgroundColor: '#1F2937',
    border: '1px solid #374151',
    borderRadius: '8px',
    color: '#F9FAFB'
  }}
/>
  <Bar dataKey="count" fill="url(#colorGradient)" />
  <defs>
    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9}/>
      <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.9}/>
    </linearGradient>
  </defs>
</BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Potencjał sprzedażowy</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
  <Pie
    data={stats.potentialData}
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={120}
    paddingAngle={5}
    dataKey="value"
  >
    {stats.potentialData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.color} />
    ))}
  </Pie>
 <RechartsTooltip
  contentStyle={{
    backgroundColor: '#1F2937',
    border: '1px solid #374151',
    borderRadius: '8px',
    color: '#F9FAFB'
  }}
/>
</RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
const RestoreView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: false });
  }, []); // tylko raz po mount
  return null;
};

const TrackView: React.FC<{ onChange: (center: [number, number], zoom: number) => void }> = ({ onChange }) => {
  useMapEvents({
    moveend: (e) => {
      const m = e.target;
      const c = m.getCenter();
      onChange([c.lat, c.lng], m.getZoom());
    },
    zoomend: (e) => {
      const m = e.target;
      const c = m.getCenter();
      onChange([c.lat, c.lng], m.getZoom());
    },
  });
  return null;
};
 const MapView = () => {
  // mniejsze piny, minimalnie większe przy dużym zbliżeniu
  const pinRadius = mapView.zoom >= 10 ? 7 : 5
  const showLabelsFromZoom = 9 // od jakiego zoomu stałe etykiety

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Mapa firm</h2>

      <FiltersBar />

      <div className="relative rounded-xl overflow-hidden" style={{ height: '600px' }}>
  <MapContainer
    center={mapView.center}
    zoom={mapView.zoom}
    scrollWheelZoom
    style={{ height: '100%', width: '100%' }}
  >
    <RestoreView center={mapView.center} zoom={mapView.zoom} />
    <TrackView onChange={(center, zoom) => setMapView({ center, zoom })} />

    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />

    {filteredCompanies
      .filter((c) => typeof c.lat === 'number' && typeof c.lng === 'number')
      .map((c) => (
        <CircleMarker
          key={c.id}
          center={[c.lat, c.lng]}
          pathOptions={{ color: c.type === 'klient' ? '#3B82F6' : '#A855F7' }}
          radius={mapView.zoom >= 10 ? 7 : 5}
          eventHandlers={{ click: () => setSelectedModal(c) }}
        >
          <Tooltip direction="top" offset={[0, -8]}>
            <div style={{ fontWeight: 600 }}>{c.name}</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>
              {c.city}{c.region ? `, ${c.region}` : ''}
            </div>
            {c.potential && (
              <div style={{ fontSize: 12, opacity: 0.85 }}>Potencjał: {c.potential}</div>
            )}
          </Tooltip>

          {mapView.zoom >= 9 && (
            <Tooltip permanent direction="bottom" offset={[0, 10]} className="marker-label">
              {c.name}
            </Tooltip>
          )}

          <Popup>
            <div style={{ minWidth: 180 }}>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {c.city}{c.region ? `, ${c.region}` : ''}
              </div>
              <div style={{ marginTop: 6 }}>
                <button
                  onClick={() => setSelectedModal(c)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: '#2563EB',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Szczegóły
                </button>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
  </MapContainer>
</div>
    </div>
  )
}

  const StrategyView = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Narzędzia strategiczne</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Systemy CRM</h3>
            <div className="space-y-3">
              {[
                { name: 'Salesforce', url: 'https://salesforce.com' },
                { name: 'HubSpot', url: 'https://hubspot.com' },
                { name: 'Pipedrive', url: 'https://pipedrive.com' },
                { name: 'Zoho CRM', url: 'https://zoho.com/crm' }
              ].map(tool => (
                <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors group">
                  <span className="text-gray-300 group-hover:text-white">{tool.name}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Bazy firm</h3>
            <div className="space-y-3">
              {[
                { name: 'Panorama Firm', url: 'https://panoramafirm.pl' },
                { name: 'Bisnode', url: 'https://bisnode.pl' },
                { name: 'KRS Online', url: 'https://krs-online.com.pl' },
                { name: 'Europages', url: 'https://europages.pl' }
              ].map(tool => (
                <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors group">
                  <span className="text-gray-300 group-hover:text-white">{tool.name}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-400" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Analizy rynku</h3>
            <div className="space-y-3">
              {[
                { name: 'GUS', url: 'https://stat.gov.pl' },
                { name: 'PAIH', url: 'https://paih.gov.pl' },
                { name: 'PARP', url: 'https://parp.gov.pl' },
                { name: 'BGK', url: 'https://bgk.pl' }
              ].map(tool => (
                <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors group">
                  <span className="text-gray-300 group-hover:text-white">{tool.name}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-400" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border border-orange-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Marketing</h3>
            <div className="space-y-3">
              {[
                { name: 'LinkedIn Sales Navigator', url: 'https://business.linkedin.com/sales-solutions' },
                { name: 'Mailchimp', url: 'https://mailchimp.com' },
                { name: 'SEMrush', url: 'https://semrush.com' },
                { name: 'Calendly', url: 'https://calendly.com' }
              ].map(tool => (
                <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors group">
                  <span className="text-gray-300 group-hover:text-white">{tool.name}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-orange-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Wskazówki strategiczne</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-blue-400 mt-1" />
              <div>
                <h4 className="font-semibold text-white">Segmentacja klientów</h4>
                <p className="text-gray-300 text-sm">Grupuj klientów według branży i potencjału sprzedażowego</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-yellow-400 mt-1" />
              <div>
                <h4 className="font-semibold text-white">Automatyzacja</h4>
                <p className="text-gray-300 text-sm">Wykorzystaj CRM do automatyzacji procesów sprzedażowych</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BarChart3 className="w-5 h-5 text-green-400 mt-1" />
              <div>
                <h4 className="font-semibold text-white">Analiza danych</h4>
                <p className="text-gray-300 text-sm">Regularnie analizuj konwersje i ROI z różnych źródeł</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Trendy branżowe</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h4 className="font-semibold text-blue-400 mb-2">Zielona transformacja</h4>
              <p className="text-gray-300 text-sm">Rosnące zapotrzebowanie na filtry ekologiczne w przemyśle</p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <h4 className="font-semibold text-purple-400 mb-2">Digitalizacja</h4>
              <p className="text-gray-300 text-sm">Inteligentne systemy filtracji z IoT i monitoringiem</p>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <h4 className="font-semibold text-green-400 mb-2">Regulacje EU</h4>
              <p className="text-gray-300 text-sm">Nowe normy emisji wymagają zaawansowanych filtrów</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        
        {activeTab === 'clients' && (
          <div>
            <FiltersBar />
            <CompanyTable companies={clients} title="Klienci" />
          </div>
        )}
        
        {activeTab === 'partners' && (
          <div>
            <FiltersBar />
            <CompanyTable companies={partners} title="Partnerzy biznesowi" />
          </div>
        )}
        
        {activeTab === 'map' && <MapView />}
        {activeTab === 'strategy' && <StrategyView />}
      </div>

      {selectedModal && (
        <CompanyModal 
          company={selectedModal} 
          onClose={() => setSelectedModal(null)} 
        />
      )}
    </div>
  );
};

export default CRMApp;
