import { useAuth } from '@/context/Auth'
import useAccount from '@/hook/useAccount'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Button } from '@/components/ReUIComponent/Button'
import { Field, Form, Formik } from 'formik'
import { CheckCircle, History, Mail, Pencil, ShieldCheck, Star, XCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import * as Yup from 'yup'

interface RewardsTier {
  currentPoints: number
  currentTier: string
  nextTier: string
  nextTierPoints: number
}

const AccountInfo: React.FC = () => {
  const auth = useAuth()
  const { user } = auth || {}
  const { goToPointHistory } = useAccount()

  const PersonalSchema = Yup.object().shape({
    firstName: Yup.string().required('Vui lòng nhập tên'),
    lastName: Yup.string().required('Vui lòng nhập họ'),
    phoneNumber: Yup.string().required('Vui lòng nhập số điện thoại'),
  })

  // Mock rewards data - replace with actual API data
  const rewardsData: RewardsTier = {
    currentPoints: 1250,
    currentTier: 'Bạc',
    nextTier: 'Vàng',
    nextTierPoints: 1500,
  }

  const progressPercentage = Math.min((rewardsData.currentPoints / rewardsData.nextTierPoints) * 100, 100)

  const handleCancel = () => {
    // Handle cancel action
  }

  return (
    <div className="space-y-6">
      {/* Rewards Banner */}
      <RewardsBanner rewardsData={rewardsData} progressPercentage={progressPercentage} onViewHistory={goToPointHistory} />

      {/* Personal Information Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Thông tin cá nhân</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Quản lý hồ sơ công khai và thông tin cá nhân của bạn.</p>

          <Formik
            initialValues={{
              firstName: user?.firstName || '',
              lastName: user?.lastName || '',
              phoneNumber: user?.phoneNumber || '',
              email: user?.email || '',
            }}
            validationSchema={PersonalSchema}
            onSubmit={(values) => {
              console.log('values', values)
            }}
            enableReinitialize
          >
            {({ errors, touched }) => (
              <Form className="space-y-8">
                {/* Profile Picture Section */}
                <ProfilePictureSection avatar={user?.avatar || ''} />

                {/* Name Fields - Two Column */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Họ
                    </label>
                    <Field name="lastName" type="text" placeholder="Họ" className="w-full bg-slate-100 dark:bg-slate-700 border-transparent text-slate-500 dark:text-slate-400 rounded-lg px-4 py-3 focus:ring-0 cursor-not-allowed" disabled />
                    {errors.lastName && touched.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName as string}</p>}
                  </div>
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Tên
                    </label>
                    <Field name="firstName" type="text" placeholder="Tên" className="w-full bg-slate-100 dark:bg-slate-700 border-transparent text-slate-500 dark:text-slate-400 rounded-lg px-4 py-3 focus:ring-0 cursor-not-allowed" disabled />
                    {errors.firstName && touched.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName as string}</p>}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-5 h-5" />
                    </span>
                    <Field name="email" type="email" placeholder="Địa chỉ email" className="w-full pl-10 bg-slate-100 dark:bg-slate-700 border-transparent text-slate-500 dark:text-slate-400 rounded-lg px-4 py-3 focus:ring-0 cursor-not-allowed" disabled />
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Email đã xác thực
                  </p>
                </div>

                {/* Phone Number Field */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Số điện thoại
                  </label>
                  <Field
                    name="phoneNumber"
                    type="tel"
                    placeholder="Số điện thoại"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                  />
                  {errors.phoneNumber && touched.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber as string}</p>}
                </div>

                {/* Account Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Trạng thái tài khoản</label>
                  <AccountStatusBadge verified={user?.verified || false} />
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <Button type="button" variant="ghost" className="px-5 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" onClick={handleCancel}>
            Hủy
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-all hover:shadow-md">
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  )
}

// Rewards Banner Component
const RewardsBanner: React.FC<{
  rewardsData: RewardsTier
  progressPercentage: number
  onViewHistory: () => void
}> = ({ rewardsData, progressPercentage, onViewHistory }) => {
  return (
    <section className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white opacity-5 blur-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Điểm thưởng Keycap Artisan</h2>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold text-white">{rewardsData.currentPoints.toLocaleString()}</span>
            <span className="text-lg text-white/70">Điểm</span>
          </div>
          <div className="w-full max-w-md">
            <div className="flex justify-between text-xs text-white/70 mb-1">
              <span>Hạng {rewardsData.currentTier}</span>
              <span className="text-yellow-300 font-medium">
                Hạng {rewardsData.nextTier} ({rewardsData.nextTierPoints} điểm)
              </span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2.5">
              <div className="bg-white h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
            </div>
            <p className="text-xs text-white/70 mt-2">Tích thêm {rewardsData.nextTierPoints - rewardsData.currentPoints} điểm để mở khóa quyền tham gia raffle độc quyền.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 font-semibold py-2.5 px-6 rounded-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2" onClick={onViewHistory}>
            <History className="w-4 h-4" />
            Lịch sử điểm
          </Button>
          <Link href="/rewards">
            <Button className="bg-white text-gray-900 hover:bg-gray-100 font-semibold py-2.5 px-6 rounded-lg shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0">Đổi thưởng</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// Profile Picture Section Component
const ProfilePictureSection: React.FC<{ avatar: string }> = ({ avatar }) => {
  const handleChangePhoto = () => {
    // Handle change photo
  }

  const handleRemovePhoto = () => {
    // Handle remove photo
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-4">Ảnh đại diện</label>
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-700 shadow-sm">
            {avatar && avatar !== '' ? <Image src={avatar} alt="Ảnh đại diện" className="w-full h-full object-cover" fill sizes="96px" /> : <AccountCircleIcon className="text-slate-400 w-full h-full" style={{ width: '100%', height: '100%' }} />}
          </div>
          <button type="button" className="absolute bottom-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 p-1.5 rounded-full shadow-md text-slate-500 hover:text-primary transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="button" variant="outline" className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" onClick={handleChangePhoto}>
              Thay đổi ảnh
            </Button>
            <Button type="button" variant="ghost" className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors" onClick={handleRemovePhoto}>
              Xóa
            </Button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Khuyến nghị: Ảnh vuông JPG, PNG. Tối đa 2MB.</p>
        </div>
      </div>
    </div>
  )
}

// Account Status Badge Component
const AccountStatusBadge: React.FC<{ verified: boolean }> = ({ verified }) => {
  if (verified) {
    return (
      <div className="inline-flex items-center px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
        <span className="text-sm font-medium text-green-800 dark:text-green-300">Tài khoản đã xác thực</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="inline-flex items-center px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
        <span className="text-sm font-medium text-red-800 dark:text-red-300">Chưa xác thực</span>
      </div>
      <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">Xác thực ngay</Button>
    </div>
  )
}

export default AccountInfo
