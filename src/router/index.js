import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'
import Login from '../components/Auth/Login.vue'
import Dashboard from '../components/Dashboard'
import LeadsList from '../components/Leads/LeadsList'
import PlantillasList from '../components/Plantillas/PlantillasList'
import OrientadoresList from '../components/Orientadores/OrientadoresList'
import AgendaActual from '../components/Agenda/AgendaActual'
import CallcenterList from '../components/Callcenter/CallcenterList'
import SearchList from '../components/Callcenter/SearchList';
import Contact from '../components/Callcenter/Contact'
import HistoricalList from '../components/Callcenter/View/HistoricalList'
import SeguimientoList from '../components/Callcenter/View/SeguimientoList'
import CallcenterSeguimiento from '../components/Callcenter/CallcenterSeguimiento'
import CallcenterCoordinatorList from '../components/Callcenter/Coordinator/CallcenterCoordinatorList'
//import CallcenterAdmisionesList from '../components/Callcenter/Coordinator/CallcenterAdmisionesList'
import LeadsNewView from '@/components/Leads/LeadsNewView'
import LeadsEditView from '@/components/Leads/LeadsEditView'
import LeadsDetailView from '@/components/Leads/LeadsDetailView'
import CRMImportar from '../components/CRM/Importar'
import CRMConsultar from '../components/CRM/Consultar'
import ReportesHits from '../components/Reportes/Hits'
import ReportesLlamadas from '../components/Reportes/Llamadas'
import ReportesLeads from '../components/Reportes/Leads'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Dashboard,
    meta: { Auth: true, title: 'Home' , view: 'baseline'},
  },
  {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { Auth: false, title: 'Iniciar sesión', view: 'clear' },
      beforeEnter: (to, from, next) => {
        if(store.state.auth.logged) {
          next({ path: '/' });
        } else {
          next();
        }
      }
    },
  {
    path: '/leads',
    name: 'leads',
    component: LeadsList,
    meta: { Auth: true, title: 'Leads - List' , view: 'baseline'},
  },
  {
    path: '/plantillas',
    name: 'plantillas',
    component: PlantillasList,
    meta: { Auth: true, title: 'Templates - List' , view: 'baseline'},
  },
  {
    path: '/orientadores',
    name: 'orientadores',
    component: OrientadoresList,
    meta: { Auth: true, title: 'Guidance - List' , view: 'baseline'},
  },
  {
    path: '/agenda',
    name: 'agenda',
    component: AgendaActual,
    meta: { Auth: true, title: 'Current Agenda' , view: 'baseline'},
  },
  {
    path: '/callcenter',
    name: 'callcenter',
    component: CallcenterList,
    meta: { Auth: true, title: 'Callcenter - List' , view: 'baseline'},
  },
  {
    path: '/consultar',
    name: 'consultar',
    component: SearchList,
    meta: { Auth: true, title: 'Consulta - List' , view: 'baseline'},
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact,
    meta: { Auth: true, title: 'Contact' , view: 'baseline'},
  },
  {
    path: '/callcenter/view/historical',
    name: 'callcenter.view.historical',
    component: HistoricalList,
    meta: { Auth: true, title: 'Callcenter - Historical - List' , view: 'baseline'},
  },
  {
    path: '/callcenter/view/tracing',
    name: 'callcenter.view.tracing',
    component: SeguimientoList,
    meta: { Auth: true, title: 'Callcenter - Tracing - List' , view: 'baseline'},
  },
  {
    path: '/callcenter/seguimientos',
    name: 'seguimiento',
    component: CallcenterSeguimiento,
    meta: { Auth: true, title: 'Callcenter - Tracing' , view: 'baseline'},
  },
  {
    path: '/callcenter_coordinator',
    name: 'callcenter_coordinator',
    component: CallcenterCoordinatorList,
    meta: { Auth: true, title: 'Callcenter - Coordinator' , view: 'baseline'},
  },
  {
    path: '/callcenter_admisiones',
    name: 'callcenter_admisiones',
    component: LeadsNewView,
    meta: { Auth: true, title: 'Nuevo' , view: 'baseline'},
  },
  {
    path: '/seguimiento/:id/edit',
    name: 'seguimiento_edit',
    component: LeadsEditView,
    meta: { Auth: true, title: 'Editar' , view: 'baseline'},
  },
  {
    path: '/seguimiento/:id/detail',
    name: 'seguimiento_detail',
    component: LeadsDetailView,
    meta: { Auth: true, title: 'Detalle' , view: 'baseline'},
  },
  {
    path: '/CRM/Importar',
    name: 'CRMImportar',
    component: CRMImportar,
    meta: { Auth: true, title: 'CRM - Importar' , view: 'baseline'},
  },
  {
    path: '/CRM/Consultar',
    name: 'CRMConsultar',
    component: CRMConsultar,
    meta: { Auth: true, title: 'CRM - Consulta' , view: 'baseline'},
  },
  {
    path: '/Reportes/Hits',
    name: 'ReportesHits',
    component: ReportesHits,
    meta: { Auth: true, title: 'Reportes - Hits' , view: 'baseline'},
  },
  {
    path: '/Reportes/Llamadas',
    name: 'ReportesLlamadas',
    component: ReportesLlamadas,
    meta: { Auth: true, title: 'Reportes - Llamadas' , view: 'baseline'},
  },
  {
    path: '/Reportes/Leads',
    name: 'ReportesLeads',
    component: ReportesLeads,
    meta: { Auth: true, title: 'Reportes - Leads' , view: 'baseline'},
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//.configurar el router
//para cada cambio de ruta

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  //console.log('validando ruta')
  //console.log('to.meta.Auth:'+to.meta.Auth)
  
  if (to.meta.Auth && !store.state.auth.logged) {
    next({path: '/login'}); 
  }else {
    if (store.state.auth.logged) {
      store.commit('auth/setUser');
    }
    if (to.meta.requerido && !store.getters['auth/permiso'](to.meta.requerido)) {
      next({path: '/no-autorizado'});
    }else{
      next();
    }
    
  }
});

//.para cada cambio de ruta

export default router
