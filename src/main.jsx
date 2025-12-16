import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'remixicon/fonts/remixicon.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { BrowserRouter } from 'react-router-dom'
import { WalletProvider } from './context/walletContext.jsx'
import { AuthProvider } from './context/authContext.jsx'

library.add(fas);


createRoot(document.getElementById('root')).render(
       <Provider store={store}>
         <BrowserRouter>
           <AuthProvider>
             <WalletProvider>
               <App />
             </WalletProvider>
           </AuthProvider>
         </BrowserRouter>
       </Provider>,
)
