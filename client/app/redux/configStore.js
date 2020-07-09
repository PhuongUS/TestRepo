import { createStore, applyMiddleware } from 'redux'

// Middleware
import logger from 'redux-logger'
import thunk from 'redux-thunk'

// Persistent
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Root reducer
import rootReducer from './rootReducer'

const persistConfig = {
    timeout: 20000,
    // timeout: 0,
    key: 'BookingAppPersist',
    storage: storage,
    whitelist: [
        'loginReducer',
    ]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(persistedReducer, applyMiddleware(logger, thunk))
const persistor = persistStore(store)

export { store, persistor }