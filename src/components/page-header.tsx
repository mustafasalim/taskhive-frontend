interface IPageHeader {
  title: string
  action?: React.ReactElement
}

const PageHeader = (props: IPageHeader) => {
  const { title, action } = props
  return (
    <div className="p-4 w-full flex  justify-between items-center">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div> {action}</div>
    </div>
  )
}

export default PageHeader
