import { getData, isValid } from '@/client'
import CategoryClient from '@/client/CategoryClient'
import { IPagination } from '@/interface/Client/interface'
import { ICategory } from '@/interface/interface'
import { createQueryKeys } from '@lukemorales/query-key-factory'

interface IQueryAllParams {
  // Optional parameters for fetching categories
  isValidate?: boolean
  // Filter by status
  status?: string
  // Filter by brand name (exact match)
  brand?: string
  // Comma-separated tag values, e.g. "hot,new"
  tags?: string
  // Full-text search across product_name and product_id
  search?: string
  // Price range filters
  minPrice?: number
  maxPrice?: number
  // Minimum average star rating
  minRating?: number
  // Sort options
  sortBy?: 'price' | 'rating' | 'created_at'
  sortOrder?: 'asc' | 'desc'
  // Filter by specific IDs
  productId?: string
  productOptionId?: string
  categoryId?: string
  // Pagination parameters
  page?: number
  limit?: number
}

export interface ICategoryListResult {
  items: ICategory[]
  pagination: IPagination
}

export const categoryQueryKeys = createQueryKeys('category', {
  getAll: (params: IQueryAllParams) => ({
    queryKey: [{ params }],
    queryFn: async ({ signal }): Promise<ICategoryListResult> => {
      const response = await CategoryClient.getAllCategory({
        params,
        signal,
      })
      return {
        items: isValid(response) ? (getData(response) as ICategory[]) : [],
        pagination: response?.pagination ?? {
          page: 1,
          total: 0,
          totalPage: 0,
          total_items: 0,
          limit: params.limit ?? 12,
          total_pages: 0,
        },
      }
    },
  }),
  getById: (id: string) => ({
    queryKey: [{ id }],
    queryFn: async () => {
      const response = await CategoryClient.getCategoryById({ id })
      if (!isValid(response)) {
        throw new Error('Category not found')
      }
      return getData(response)?.[0] as ICategory
    },
  }),
  create: (data: ICategory) => ({
    queryKey: [{ data }],
    queryFn: async ({ signal }) => {
      const response = await CategoryClient.postCreateCategory({
        body: data,
        signal,
      })
      if (!isValid(response)) {
        throw new Error('Failed to create category')
      }
      return getData(response)?.[0] as ICategory
    },
  }),
})
