'use client';

import { useState } from 'react';
import { statistics, projects, skills } from '@/data/portfolio-data';
import ChartComponent from '@/components/ChartComponent';
import { BarChart3, PieChart, TrendingUp, Activity, Users, Code } from 'lucide-react';

export default function AnalyticsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredStats = selectedCategory === 'all' 
    ? statistics 
    : statistics.filter(stat => stat.category === selectedCategory);

  const projectStats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    featured: projects.filter(p => p.featured).length
  };

  const skillsByCategory = {
    frontend: skills.filter(s => s.category === 'frontend').length,
    backend: skills.filter(s => s.category === 'backend').length,
    devops: skills.filter(s => s.category === 'devops').length,
    languages: skills.filter(s => s.category === 'languages').length
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Analytics & Statistics
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Data-driven insights into projects, skills, and technical expertise
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Code className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {projectStats.total}
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">Total Projects</h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {projectStats.completed} completed
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {skills.length}
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">Technical Skills</h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Across {Object.keys(skillsByCategory).length} categories
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length)}%
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">Avg Skill Level</h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Proficiency rating
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {projectStats.featured}
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">Featured Work</h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Highlighted projects
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'skills', 'projects'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredStats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stat.title}
                </h3>
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  {stat.chartType === 'bar' && <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                  {(stat.chartType === 'pie' || stat.chartType === 'doughnut') && <PieChart className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                  {(stat.chartType === 'line' || stat.chartType === 'area') && <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                  {stat.chartType === 'radar' && <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                </div>
              </div>
              <ChartComponent statistic={stat} height={300} />
            </div>
          ))}
        </div>

        {/* Data Table */}
        <div className="mt-12 bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Skills Breakdown
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Skill
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Proficiency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Level
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {skills.map((skill) => (
                  <tr key={skill.name} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {skill.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs">
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {skill.level}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}