import LoadingComponent from '../Loading'

interface IProps {
  value: any
}

export default function ExistingData({ value }: IProps) {
  if (!value) {
    return <LoadingComponent />
  }
  return value
}
