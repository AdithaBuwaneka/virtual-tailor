// components/tailor/PortfolioManagement.tsx - Portfolio Management Interface
import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Eye, 
  Heart, 
  MessageCircle, 
  Star,
  Upload,
  Camera,
  // Video, // Unused import
  Award,
  TrendingUp,
  Search,
  // Filter, // Unused import
  Grid3X3,
  List,
  BarChart3,
  Settings,
  Share2,
  Download
} from 'lucide-react';
import type { PortfolioProject, SkillCertification, PortfolioAnalytics } from '../../types/portfolio';

interface PortfolioManagementProps {
  projects: PortfolioProject[];
  certifications: SkillCertification[];
  analytics: PortfolioAnalytics;
  onCreateProject: () => void;
  onEditProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onPublishProject: (projectId: string) => void;
  onFeatureProject: (projectId: string) => void;
}

export const PortfolioManagement: React.FC<PortfolioManagementProps> = ({
  projects,
  certifications,
  analytics,  onCreateProject,
  onEditProject
  // Commented out unused props for future functionality
  // onDeleteProject,
  // onPublishProject,
  // onFeatureProject
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'projects' | 'analytics' | 'certifications'>('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'featured'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  // Commented out unused state for future functionality
  // const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.garmentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const getStatusColor = (status: PortfolioProject['status']) => {
    switch (status) {
      case 'published': return 'text-green-700 bg-green-100 border-green-200';
      case 'featured': return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'draft': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'archived': return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: PortfolioProject['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-700 bg-green-100';
      case 'intermediate': return 'text-blue-700 bg-blue-100';
      case 'advanced': return 'text-orange-700 bg-orange-100';
      case 'expert': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: Grid3X3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'certifications', label: 'Certifications', icon: Award }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
          <p className="text-gray-600 mt-2">Showcase your work and attract more customers</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4" />
            Share Portfolio
          </button>
          <button
            onClick={onCreateProject}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalViews.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Views</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalLikes.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Likes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalInquiries.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Inquiries</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {(analytics.conversionRate * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Conversion Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-8">
              {/* Top Performing Projects */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analytics.topPerformingProjects.slice(0, 3).map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-gray-100 relative">
                        {project.images[0] ? (
                          <img
                            src={project.images[0].url}
                            alt={project.images[0].alt}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{project.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {project.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {project.likes}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(project.price, project.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={onCreateProject}
                    className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="w-6 h-6 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Add New Project</span>
                  </button>
                  
                  <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Bulk Upload</span>
                  </button>
                  
                  <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings className="w-6 h-6 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Portfolio Settings</span>
                  </button>
                  
                  <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-6 h-6 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Export Portfolio</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-900">New inquiry received for "Vintage Wedding Dress"</p>
                      <p className="text-xs text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-900">Your "Traditional Indian Lehenga" project received 50 new views</p>
                      <p className="text-xs text-gray-600">1 day ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-900">5-star review added to "Modern Business Suit"</p>
                      <p className="text-xs text-gray-600">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {selectedTab === 'projects' && (
            <div className="space-y-6">
              {/* Filters and Search */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="featured">Featured</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Projects Grid/List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group">
                      <div className="aspect-video bg-gray-100 relative">
                        {project.images[0] ? (
                          <img
                            src={project.images[0].url}
                            alt={project.images[0].alt}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button
                              onClick={() => onEditProject(project.id)}
                              className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                            {project.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 flex-grow">{project.title}</h4>
                          <div className="flex items-center gap-1 ml-2">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">{project.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>{project.garmentType}</span>
                          <span>{project.timeToComplete}h</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {project.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {project.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {project.inquiries}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(project.price, project.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="flex items-center gap-6 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                        {project.images[0] ? (
                          <img
                            src={project.images[0].url}
                            alt={project.images[0].alt}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{project.title}</h4>
                          <div className="flex items-center gap-2 ml-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                              {project.difficulty}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{project.description}</p>
                        
                        <div className="flex items-center gap-6 text-xs text-gray-500">
                          <span>{project.garmentType}</span>
                          <span>{project.timeToComplete}h</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {project.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {project.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            {project.rating.toFixed(1)}
                          </span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(project.price, project.currency)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditProject(project.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'No projects match your current filters.' 
                      : "Start building your portfolio by adding your first project."
                    }
                  </p>
                  {!searchTerm && filterStatus === 'all' && (
                    <button
                      onClick={onCreateProject}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Project
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {selectedTab === 'analytics' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
                
                {/* Analytics Chart Placeholder */}
                <div className="bg-gray-50 rounded-lg p-8 mb-6">
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Portfolio analytics chart would be displayed here</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Views, likes, inquiries, and conversion tracking over time
                      </p>
                    </div>
                  </div>
                </div>

                {/* Analytics Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Projects by Garment Type</h4>
                    <div className="space-y-3">
                      {analytics.projectsByGarmentType.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{item.type}</span>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-900">
                              {item.count} projects
                            </span>
                            <div className="text-xs text-gray-600">
                              {formatCurrency(item.revenue)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Skill Demand</h4>
                    <div className="space-y-3">
                      {analytics.skillDemand.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{skill.skill}</span>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-900">
                              {skill.demand} inquiries
                            </span>
                            <div className="text-xs text-gray-600">
                              Avg: {formatCurrency(skill.avgPrice)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Certifications Tab */}
          {selectedTab === 'certifications' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Skill Certifications</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Certification
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certifications.map((cert) => (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-900 mb-2">{cert.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">Issued by {cert.issuedBy}</p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            cert.level === 'master' ? 'bg-purple-100 text-purple-700' :
                            cert.level === 'advanced' ? 'bg-red-100 text-red-700' :
                            cert.level === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {cert.level}
                          </span>
                          <span className="text-xs text-gray-500">
                            Issued: {cert.issuedAt.toLocaleDateString()}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {cert.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                              {cert.skills.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{cert.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-600">
                              Verification: {cert.verificationCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {certifications.length === 0 && (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No certifications yet</h3>
                  <p className="text-gray-600 mb-6">
                    Add certifications to showcase your expertise and build customer trust.
                  </p>
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Your First Certification
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};