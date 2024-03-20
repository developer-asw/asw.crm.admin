import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'
import Login from '../components/Auth/Login.vue'
import Dashboard from '../components/Dashboard'
import Consultar from '../components/Consultar'
import LeadsList from '../components/Leads/LeadsList'
import PlantillasList from '../components/Plantillas/PlantillasList'
import OrientadoresList from '../components/Orientadores/OrientadoresList'
import AgendaActual from '../components/Agenda/AgendaActual'
import CallcenterList from '../components/Callcenter/CallcenterList';
import VentaTelefonicaList from '../components/Callcenter/VentaTelefonicaList';
import Convenio from '../components/Callcenter/Convenio';
import Contact from '../components/Callcenter/Contact'
import CallcenterSeguimiento from '../components/Callcenter/CallcenterSeguimiento'
import CallcenterCoordinatorList from '../components/Callcenter/Coordinator/CallcenterCoordinatorList'
import LeadsNewView from '@/components/Leads/LeadsNewView'
import LeadsEditView from '@/components/Leads/LeadsEditView'
import LeadsDetailView from '@/components/Leads/LeadsDetailView'
import CRMImportar from '../components/CRM/Importar'
import CRMConsultar from '../components/CRM/Consultar'
import ReportesHits from '../components/Reportes/Hits'
import ReportesLlamadas from '../components/Reportes/Llamadas'
import ReportesLeads from '../components/Reportes/Leads'
import ReportesCitas from '../components/Reportes/Citas'
import ReportesAgentes from '../components/Reportes/Agentes'
import ReportesReferidos from '../components/Reportes/Referidos'
import RecepcionView from '@/components/Recepcion/RecepcionView'

import MissedAppointments from '@/components/Settings/MissedAppointments';
import IncomingData from '@/components/Settings/IncomingData';
import Parameters from '@/components/Settings/Parameters';
import Wolkvox from '@/components/Settings/Wolkvox';
import Calendario from '@/components/Settings/Calendario';

import ADMUsuario from '@/components/Administracion/Usuarios';
import ADMSedes from '@/components/Administracion/Sedes';
import ADMPerfiles from '@/components/Administracion/Perfiles/Perfiles';
import ADMPermisos from '@/components/Administracion/Permisos';
import ADMAsignarPermisos from '@/components/Administracion/Perfiles/AsignarPermisos';
import ProfileUser from '@/components/Profile/User';
import CallcenterMatriculados from '../components/ApoyoFinanciero/CallcenterMatriculados';
import AFSeguimiento from '../components/ApoyoFinanciero/Seguimiento'
import OrientadorList from '@/components/Coordinador/OrientadorList';
import OrientadorDatosList from '@/components/Coordinador/OrientadorDatosList';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Consultar,
    meta: { Auth: true, title: 'Home' , view: 'baseline'},
  },
  {
    path: '/dashboard',
    name: 'stat',
    component: Dashboard,
    meta: { Auth: true, title: 'Dashboard' , view: 'baseline'},
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
    meta: { Auth: true, title: 'Leads - Lista' , view: 'baseline'},
  },
  {
    path: '/plantillas',
    name: 'plantillas',
    component: PlantillasList,
    meta: { Auth: true, title: 'Templates - Lista' , view: 'baseline'},
  },
  {
    path: '/orientadores/consulta',
    name: 'orientadores',
    component: OrientadoresList,
    meta: { Auth: true, title: 'Guidance - Lista' , view: 'baseline'},
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
    meta: { Auth: true, title: 'Callcenter - Lista' , view: 'baseline'},
  },
  {
    path: '/venta_telefonica',
    name: 'venta_telefonica',
    component: VentaTelefonicaList,
    meta: { Auth: true, title: 'Venta Teléfonica - Lista' , view: 'baseline'},
  },
  {
    path: '/callcenter/convenio',
    name: 'convenio',
    component: Convenio,
    meta: { Auth: true, title: 'Convenio - Lista' , view: 'baseline'},
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact,
    meta: { Auth: true, title: 'Contact' , view: 'baseline'},
  },
  {
    path: '/consultas/seguimientos',
    name: 'seguimiento',
    component: CallcenterSeguimiento,
    meta: { Auth: true, title: 'Callcenter - Seguimiento' , view: 'baseline'},
  },
  {
    path: '/apoyofinanciero/matriculados',
    name: 'matriculados',
    component: CallcenterMatriculados,
    meta: { Auth: true, title: 'Callcenter - Matriculados' , view: 'baseline'},
  },
  {
    path: '/apoyofinanciero/seguimientos',
    name: 'seguimiento',
    component: AFSeguimiento,
    meta: { Auth: true, title: 'Callcenter - Seguimiento' , view: 'baseline'},
  },
  {
    path: '/callcenter_coordinator',
    name: 'callcenter_coordinator',
    component: CallcenterCoordinatorList,
    meta: { Auth: true, title: 'Callcenter - Coordinator' , view: 'baseline'},
  },
  {
    path: '/coordinador/orientadores',
    name: 'Orientadores',
    component: OrientadorList,
    meta: { Auth: true, title: 'Orientadores - Coordinator' , view: 'baseline'},
  },
  {
    path: '/coordinador/orientadores/:id/datos',
    name: 'Orientadores_datos',
    component: OrientadorDatosList,
    meta: { Auth: true, title: 'Datos - Orientadores - Coordinator' , view: 'baseline'},
  },
  {
    path: '/lead/new',
    name: 'lead_new',
    component: LeadsNewView,
    meta: { Auth: true, title: 'Nuevo' , view: 'baseline'},
  },
  {
    path: '/lead/:id/edit',
    name: 'lead_edit',
    component: LeadsEditView,
    meta: { Auth: true, title: 'Editar' , view: 'baseline'},
  },
  {
    path: '/lead/:id/detail',
    name: 'lead_detail',
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
    path: '/Reportes/Citas',
    name: 'ReportesCitas',
    component: ReportesCitas,
    meta: { Auth: true, title: 'Reportes - Citas' , view: 'baseline'},
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
    path: '/Reportes/Agentes',
    name: 'ReportesAgentes',
    component: ReportesAgentes,
    meta: { Auth: true, title: 'Reportes - Tareas' , view: 'baseline'},
  },
  {
    path: '/Reportes/Referidos',
    name: 'ReportesReferidos',
    component: ReportesReferidos,
    meta: { Auth: true, title: 'Reportes - Referidos' , view: 'baseline'},
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/recepcion/:id/view',
    name: 'recepcion_view',
    component: RecepcionView,
    meta: { Auth: true, title: 'Recepcion' , view: 'baseline'},
  },
  {
    path: '/setting/missed_appointments',
    name: 'MissedAppointments',
    component: MissedAppointments,
    meta: { Auth: true, title: 'Settings - missed_appointments' , view: 'baseline'},
  },
  {
    path: '/setting/incoming_data',
    name: 'IncomingData',
    component: IncomingData,
    meta: { Auth: true, title: 'Settings - incoming_data' , view: 'baseline'},
  },
  {
    path: '/setting/parameters',
    name: 'Parameters',
    component: Parameters,
    meta: { Auth: true, title: 'Settings - parameters' , view: 'baseline'},
  },
  {
    path: '/setting/calendar',
    name: 'Calendario',
    component: Calendario,
    meta: { Auth: true, title: 'Settings - calendar' , view: 'baseline'},
  },
  {
    path: '/setting/wolkvox',
    name: 'Wolkvox',
    component: Wolkvox,
    meta: { Auth: true, title: 'Settings - Wolkvox' , view: 'baseline'},
  },
  {
    path: '/administracion/usuarios',
    name: 'ADMUsuario',
    component: ADMUsuario,
    meta: { Auth: true, title: 'Administración - Usuarios' , view: 'baseline'},
  },
  {
    path: '/administracion/sedes',
    name: 'ADMSedes',
    component: ADMSedes,
    meta: { Auth: true, title: 'Administración - Sedes' , view: 'baseline'},
  },
  {
    path: '/administracion/perfiles',
    name: 'ADMPerfiles',
    component: ADMPerfiles,
    meta: { Auth: true, title: 'Administración - Perfiles' , view: 'baseline'},
  },
  {
    path: '/administracion/permisos',
    name: 'ADMPermisos',
    component: ADMPermisos,
    meta: { Auth: true, title: 'Administración - Perfiles' , view: 'baseline'},
  },
  {
    path: '/administracion/perfiles/:id/permisos',
    name: 'ADMAsignarPermisos',
    component: ADMAsignarPermisos,
    meta: { Auth: true, title: 'Administración - Perfiles - Permisos' , view: 'baseline'},
  },
  {
    path: '/profile/user',
    name: 'ProfileUser',
    component: ProfileUser,
    meta: { Auth: true, title: 'Profile - User' , view: 'baseline'},
  },
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
