import React,{Suspense} from 'react';
import { Routes, Route } from "react-router-dom";
import Loader from '../Components/Common/Loader';
//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import Layout from "../Layouts/index";

//routes
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import { AuthProtected } from './AuthProtected';

const Index = () => {
    return (
        <React.Fragment>
            <Suspense fallback={<Loader />}>
            <Routes>
                <Route>
                    {publicRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <NonAuthLayout>
                                    {route.component}
                                </NonAuthLayout>
                            }
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>

                <Route>
                    {authProtectedRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <AuthProtected>
                                    <Layout>{route.component}</Layout>
                                </AuthProtected>}
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>
            </Routes>
            </Suspense>
        </React.Fragment>
    );
};

export default Index;