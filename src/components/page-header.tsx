import { ReactNode } from "react"

interface IPageHeader {
  title: ReactNode
  actions?: ReactNode
}

const PageHeader = (props: IPageHeader) => {
  const { title, actions } = props
  return (
    <div className="px-2 py-1 w-full flex justify-between items-center border-b min-h-[50px] sticky top-0 ">
      <div className="text-sm font-semibold">{title}</div>
      <div>{actions}</div>
    </div>
  )
}

export default PageHeader
