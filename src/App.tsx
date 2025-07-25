import { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import styled from 'styled-components'
import { store } from './store/store'
import { Header } from './components/UI/Header'
import { Sidebar } from './components/UI/Sidebar'
import { GridViewer } from './components/3D/GridViewer'
import { Dashboard } from './components/Dashboard/Dashboard'
import { ComponentLibrary } from './components/Library/ComponentLibrary'
import { Analytics } from './components/Analytics/Analytics'
import { GlobalStyle } from './styles/GlobalStyle'
import { LoadingScreen } from './components/UI/LoadingScreen'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`

const ContentArea = styled.main`
  flex: 1;
  position: relative;
  overflow: hidden;
`

function App() {
  return (
    <Provider store={store}>
      <Router>
        <GlobalStyle />
        <AppContainer>
          <Header />
          <MainContent>
            <Sidebar />
            <ContentArea>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<GridViewer />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/library" element={<ComponentLibrary />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Routes>
              </Suspense>
            </ContentArea>
          </MainContent>
        </AppContainer>
      </Router>
    </Provider>
  )
}

export default App
