interface LayoutProps {
  children: React.ReactNode
  isBlackBackground: boolean
  showFooter?: boolean
}

const Layout = ({ children, isBlackBackground, showFooter = true }: LayoutProps) => {
  return (
    <div
      style={{
        backgroundColor: isBlackBackground ? "black" : "white",
        minHeight: "100vh",
        overflow: "hidden"
      }}>
      {children}
      {showFooter && <footer>Footer content</footer>}
    </div>
  )
}

export default Layout