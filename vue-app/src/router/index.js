import Vue from 'vue'
import Router from 'vue-router'
const Index = () => import("@/components/Index");
// import Index from '@/components/Index'
const Login = () => import("@/components/Login");
// import Login from '@/components/Login'
const UserList = () => import("@/components/UserList");
// import UserList from '@/components/UserList'
const RolesList = () => import("@/components/RolesList");
// import RolesList from '@/components/RolesList'
const JurisdictionList = () => import("@/components/JurisdictionList");
// import JurisdictionList from '@/components/JurisdictionList'
const DataTable = () => import("@/components/DataTable");
// import DataTable from '@/components/DataTable'
const GoodList = () => import("@/components/GoodList");
// import GoodList from '@/components/GoodList'
const AddGood = () => import("@/components/AddGood");
// import AddGood from '@/components/AddGood'
const OrderList = () => import("@/components/OrderList");
// import OrderList from '@/components/OrderList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: [
        {
          path: '/users',
          name: 'UserList',
          component: UserList
        },
        {
          path: '/roles',
          name: 'RolesList',
          component: RolesList
        },
        {
          path: '/rights',
          name: 'JurisdictionList',
          component: JurisdictionList
        },
        {
          path: '/reports',
          name: 'DataTable',
          component: DataTable
        },
        {
          path: '/goods',
          name: 'GoodList',
          component: GoodList
        },
        {
          path: '/AddGood',
          name: 'AddGood',
          component: AddGood
        },
        
        {
          path: '/orders',
          name: 'OrderList',
          component: OrderList
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
