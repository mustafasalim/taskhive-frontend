interface IPageHeader {
  title: string
  action?: React.ReactElement
}

const PageHeader = (props: IPageHeader) => {
  const { title, action } = props
  return (
    <div className="px-2 py-1 w-full flex  justify-between items-center border-b ">
      <h1 className="text-sm  font-semibold">{title}</h1>
      <div>{action}</div>
    </div>
  )
}

export default PageHeader
