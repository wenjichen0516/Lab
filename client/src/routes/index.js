import React, { lazy, Suspense } from 'react'
import { Redirect } from 'react-router-dom'
import BasicLayout from '../layouts/BasicLayout'
import BlankLayout from '../layouts/BlankLayout'
import CustomPlaceholder from '../basicUI/Placeholder'

const SuspenseComponent = Component => props => {
    return(
        <Suspense fallback={ <CustomPlaceholder />}>
            <Component {...props}></Component>
        </Suspense>
    )
}

const PageHome = lazy(() => import('../views/Home'));
const Page404 = lazy(() => import('../views/404'));
const PageSex = lazy(() => import('../views/Sex'));
const PageAntibody = lazy(() => import('../views/Antibody'));
const PageAssayType = lazy(() => import('../views/AssayType'));
const PageBarcode = lazy(() => import('../views/Barcode'));
const PageCellLine = lazy(() => import('../views/CellLine'));
const PageLab = lazy(() => import('../views/Lab'));
const PageCondition = lazy(() => import('../views/Condition'));
const PageFactory = lazy(() => import('../views/Factory'));
const PageIndividual = lazy(() => import('../views/Individual'));
const PageTissuePro = lazy(() => import('../views/TissueProcessing'));
const PageTissue = lazy(() => import('../views/Tissue'));
const PageStrain = lazy(() => import('../views/Strain'));
const PageSpecies = lazy(() => import('../views/Species'));
const PageInventory = lazy(() => import('../views/Inventory'));
const PageChipSeq = lazy(() => import('../views/ChipSeq'));

export default [
    {
        component: BlankLayout,
        routes: [
            {
                path: '/',
                component: BasicLayout,
                routes: [
                    {
                        path: '/',
                        exact: true,
                        render: () => <Redirect to={ '/Home' } />
                    },
                    {
                        path: '/Home',
                        exact: true,
                        component: SuspenseComponent(PageHome)
                        
                    },
                    {
                        path: '/Sex',
                        exact: true,
                        component: SuspenseComponent(PageSex)
                    },
                    {
                        path: '/Antibody',
                        exact: true,
                        component: SuspenseComponent(PageAntibody)
                    },
                    {
                        path: '/AssayType',
                        exact: true,
                        component: SuspenseComponent(PageAssayType)
                    },
                    {
                        path: '/Barcode',
                        exact: true,
                        component: SuspenseComponent(PageBarcode)
                    },
                    {
                        path: '/CellLine',
                        exact: true,
                        component: SuspenseComponent(PageCellLine)
                    },
                    {
                        path: '/Lab',
                        exact: true,
                        component: SuspenseComponent(PageLab)
                    },
                    {
                        path: '/Condition',
                        exact: true,
                        component: SuspenseComponent(PageCondition)
                    },
                    {
                        path: '/Factory',
                        exact: true,
                        component: SuspenseComponent(PageFactory)
                    },
                    {
                        path: '/Individual',
                        exact: true,
                        component: SuspenseComponent(PageIndividual)
                    },
                    {
                        path: '/TissuePro',
                        exact: true,
                        component: SuspenseComponent(PageTissuePro)
                    },
                    {
                        path: '/Tissue',
                        exact: true,
                        component: SuspenseComponent(PageTissue)
                    },
                    {
                        path: '/Strain',
                        exact: true,
                        component: SuspenseComponent(PageStrain)
                    },
                    {
                        path: '/Species',
                        exact: true,
                        component: SuspenseComponent(PageSpecies)
                    },
                    {
                        path: '/Inventory',
                        exact: true,
                        component: SuspenseComponent(PageInventory)
                    },
                    {
                        path: '/Chip-seq',
                        exact: true,
                        component: SuspenseComponent(PageChipSeq)
                    },
                    {
                        path: '/404',
                        exact: true,
                        component: SuspenseComponent(Page404)
                    },
                    {
                        path: '/*',
                        exact: true,
                        component: SuspenseComponent(Page404)
                    },
                   
                ]
            }
        ]
    }
]