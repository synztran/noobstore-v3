import { ICollapseContent } from '@/interface/interface'
import { Brush, Diamond, Info } from 'lucide-react'
import { useState } from 'react'

interface ProductDetailTabsProps {
  description?: string
  collapseContent?: ICollapseContent[]
  brand?: string
}

type TabId = 'description' | 'specifications' | 'shipping'

const ProductDetailTabs = ({ description, collapseContent, brand }: ProductDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabId>('description')

  const tabs: { id: TabId; label: string }[] = [
    { id: 'description', label: 'Mô tả' },
    { id: 'specifications', label: 'Thông số' },
    { id: 'shipping', label: 'Vận chuyển & Đổi trả' },
  ]

  return (
    <div className="border-t border-slate-200 dark:border-slate-700">
      {/* Tab Headers */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 px-6 lg:px-10">
        <div className="flex gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-primary border-primary' : 'text-slate-500 dark:text-slate-400 hover:text-primary border-transparent'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 lg:p-10 min-h-75">
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6 text-slate-600 dark:text-slate-400 text-sm leading-7">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Thông tin sản phẩm</h3>
              {description && <p>{description}</p>}

              {/* Collapse Content */}
              {collapseContent &&
                collapseContent.map((item, idx) => (
                  <div key={idx}>
                    {item.title && <h4 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>}
                    {item.content && <div dangerouslySetInnerHTML={{ __html: item.content }} />}
                  </div>
                ))}

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Brush className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Thủ công</h4>
                    <p className="text-xs mt-1">Mỗi sản phẩm được làm thủ công bởi nghệ nhân có kinh nghiệm.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Diamond className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Chất lượng cao</h4>
                    <p className="text-xs mt-1">Nguyên liệu cao cấp, bền bỉ với thời gian.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Care Instructions */}
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-fit">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Hướng dẫn bảo quản
              </h4>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Vệ sinh bằng khăn microfiber.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Tránh sử dụng cồn hoặc dung môi mạnh.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Tránh tiếp xúc trực tiếp với ánh nắng.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Cẩn thận khi tháo lắp.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specifications' && (
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Chi tiết kỹ thuật</h3>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-700">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 font-medium text-sm text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700">Thương hiệu</div>
                <div className="p-4 text-sm text-slate-600 dark:text-slate-400">{brand || 'NoobStore'}</div>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-700">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 font-medium text-sm text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700">Stem</div>
                <div className="p-4 text-sm text-slate-600 dark:text-slate-400">Cherry MX (Cross)</div>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-700">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 font-medium text-sm text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700">Profile</div>
                <div className="p-4 text-sm text-slate-600 dark:text-slate-400">SA R1, Cherry R1, OEM R1</div>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-700">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 font-medium text-sm text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700">Kích thước</div>
                <div className="p-4 text-sm text-slate-600 dark:text-slate-400">1u (khoảng 18mm x 18mm)</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 font-medium text-sm text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700">Xuất xứ</div>
                <div className="p-4 text-sm text-slate-600 dark:text-slate-400">Việt Nam</div>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Tab */}
        {activeTab === 'shipping' && (
          <div className="max-w-2xl space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Thông tin vận chuyển</h3>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <p>Đơn hàng sẽ được xử lý trong vòng 1-2 ngày làm việc. Thời gian giao hàng dự kiến:</p>
                <ul className="space-y-2 pl-4">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Nội thành HCM/Hà Nội: 1-2 ngày</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Các tỉnh/thành khác: 3-5 ngày</span>
                  </li>
                </ul>
                <p className="text-green-600 dark:text-green-400 font-medium">Miễn phí vận chuyển cho đơn hàng từ 500.000đ</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Chính sách đổi trả</h3>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <p>Chúng tôi chấp nhận đổi trả trong vòng 7 ngày kể từ ngày nhận hàng với các điều kiện:</p>
                <ul className="space-y-2 pl-4">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Sản phẩm còn nguyên tem, nhãn mác</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Chưa qua sử dụng</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Có video unbox từ đầu đến cuối</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetailTabs
