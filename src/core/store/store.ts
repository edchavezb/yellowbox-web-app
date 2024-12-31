import { AnyAction, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { createLogger } from 'redux-logger';
import rootReducer from "./reducers";

const logger: any = createLogger();
const preloadedState = {}

const store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(logger),
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production' && typeof window === 'object',
    preloadedState
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
>

export default store;