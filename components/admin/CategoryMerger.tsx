// components/admin/CategoryMerger.tsx

import { useState } from 'react'
import { 
  Merge, Loader2, CheckCircle, XCircle, AlertTriangle, 
  RefreshCw, Eye, ArrowRight, Database
} from 'lucide-react'
import toast from 'react-hot-toast'

interface CategoryAnalysis {
  originalCategory: string
  suggestedCategory: string
  reason: string
  articleCount: number
  confidence: 'high' | 'medium' | 'low'
}

interface CategoryMergerProps {
  onMergeComplete?: () => void
}

export default function CategoryMerger({ onMergeComplete }: CategoryMergerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isMerging, setIsMerging] = useState(false)
  const [suggestions, setSuggestions] = useState<CategoryAnalysis[]>([])
  const [approvedMerges, setApprovedMerges] = useState<Set<string>>(new Set())
  const [showPreview, setShowPreview] = useState(false)

  const analyzeCategories = async () => {
    setIsAnalyzing(true)
    const loadingToast = toast.loading('AI is analyzing categories for duplicates...')

    try {
      const response = await fetch('/api/admin/categories/analyze', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setSuggestions(data.suggestions)
        toast.success(`Found ${data.suggestions.length} potential category mergers!`, {
          id: loadingToast,
        })
      } else {
        toast.error(data.error || 'Failed to analyze categories', {
          id: loadingToast,
        })
      }
    } catch (error) {
      toast.error('An error occurred while analyzing categories', {
        id: loadingToast,
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleApproval = (originalCategory: string) => {
    const newApproved = new Set(approvedMerges)
    if (newApproved.has(originalCategory)) {
      newApproved.delete(originalCategory)
    } else {
      newApproved.add(originalCategory)
    }
    setApprovedMerges(newApproved)
  }

  const approveAll = () => {
    const allCategories = suggestions.map(s => s.originalCategory)
    setApprovedMerges(new Set(allCategories))
  }

  const rejectAll = () => {
    setApprovedMerges(new Set())
  }

  const executeMerges = async () => {
    if (approvedMerges.size === 0) {
      toast.error('Please approve at least one merge')
      return
    }

    const isConfirmed = window.confirm(
      `⚠️ CATEGORY MERGE WARNING ⚠️\n\nYou are about to merge ${approvedMerges.size} categories.\n\n🔄 This will update article categories in the database\n🔗 Category URLs will change\n📊 This action cannot be undone\n\nAre you sure you want to proceed?`
    )

    if (!isConfirmed) return

    setIsMerging(true)
    const loadingToast = toast.loading('Merging categories...')

    try {
      const mergesToExecute = suggestions.filter(s => approvedMerges.has(s.originalCategory))

      const response = await fetch('/api/admin/categories/merge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ merges: mergesToExecute }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Successfully merged ${data.mergedCount} categories affecting ${data.articlesUpdated} articles!`, {
          id: loadingToast,
        })
        
        // Reset state
        setSuggestions([])
        setApprovedMerges(new Set())
        
        // Callback to refresh parent data
        if (onMergeComplete) {
          onMergeComplete()
        }
      } else {
        toast.error(data.error || 'Failed to merge categories', {
          id: loadingToast,
        })
      }
    } catch (error) {
      toast.error('An error occurred while merging categories', {
        id: loadingToast,
      })
    } finally {
      setIsMerging(false)
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const totalArticlesAffected = suggestions
    .filter(s => approvedMerges.has(s.originalCategory))
    .reduce((sum, s) => sum + s.articleCount, 0)

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Merge className="w-5 h-5 mr-2" />
              AI Category Merger
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Automatically detect and merge duplicate categories using AI analysis
            </p>
          </div>
          <button
            onClick={analyzeCategories}
            disabled={isAnalyzing || isMerging}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Analyze Categories
              </>
            )}
          </button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="px-6 py-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Database className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Total Suggestions</p>
                  <p className="text-lg font-bold text-blue-600">{suggestions.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-900">Approved Merges</p>
                  <p className="text-lg font-bold text-green-600">{approvedMerges.size}</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-orange-900">Articles Affected</p>
                  <p className="text-lg font-bold text-orange-600">{totalArticlesAffected}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <button
                onClick={approveAll}
                className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200"
              >
                Approve All
              </button>
              <button
                onClick={rejectAll}
                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200"
              >
                Reject All
              </button>
            </div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
            >
              <Eye className="w-4 h-4 mr-1" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>

          {/* Suggestions Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merge To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Articles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {suggestions.map((suggestion, index) => (
                  <tr key={index} className={approvedMerges.has(suggestion.originalCategory) ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleApproval(suggestion.originalCategory)}
                        className={`p-2 rounded-md ${
                          approvedMerges.has(suggestion.originalCategory)
                            ? 'text-green-600 bg-green-100'
                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {approvedMerges.has(suggestion.originalCategory) ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {suggestion.originalCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-indigo-600">
                          {suggestion.suggestedCategory}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{suggestion.articleCount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(suggestion.confidence)}`}>
                        {suggestion.confidence}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{suggestion.reason}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Execute Button */}
          {approvedMerges.size > 0 && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={executeMerges}
                disabled={isMerging}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMerging ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Merging...
                  </>
                ) : (
                  <>
                    <Merge className="w-4 h-4 mr-2" />
                    Execute {approvedMerges.size} Merges
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isAnalyzing && suggestions.length === 0 && (
        <div className="px-6 py-12 text-center">
          <Merge className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Yet</h3>
          <p className="text-gray-500 mb-4">
            Click "Analyze Categories" to let AI detect duplicate categories that can be merged.
          </p>
          <div className="text-sm text-gray-400">
            <p>• AI will analyze category names for semantic duplicates</p>
            <p>• You can review and approve suggestions before merging</p>
            <p>• Categories will be consolidated to improve organization</p>
          </div>
        </div>
      )}
    </div>
  )
}