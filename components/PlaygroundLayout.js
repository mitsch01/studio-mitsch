const Layout = ({ children, isBlackBackground }) => {
  return (
    <div
      style={{
        backgroundColor: isBlackBackground ? "black" : "white",
        minHeight: "100vh", 
        overflow: "hidden" 
      }}>
      {children}
    </div>
  )
}

export default Layout
