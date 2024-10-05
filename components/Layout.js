import React from "react"

const Layout = ({ children, isBlackBackground }) => {
  return (
    <div
      style={{
        backgroundColor: isBlackBackground ? "black" : "white", 
        minHeight: "100vh",
      }}>
      {children}
    </div>
  )
}

export default Layout
