# HISTORIAS DE USUARIO
## Administrador - Gestión de usuarios, roles y permisos
## Administrador - Gestión de sedes
## Administrador - Gestión de vendedores
## Administrador - Agenda
## Landing Page - Registro de leads
## Vendedor - Citas
## Administrador - Gestión de leads
## Automatización - Confirmación de citas
## Automatización - Recordatorio de cita
## Automatización - Solicitud de reagendamiento
## Automatización - Envío a CRM

asw-leads-admin.extandar.com (asw-leads-admin)
asw-leads.extandar.com (landing) (asw-leads-landing)
asw-leads.extandar.com/api (asw-leads-api)
asw-leads-seller.extandar.com (asw-leads-seller)

asw.extandar.com
admin-asw.extandar.com
teacher-asw.extandar.com


Reglas de negocio
Un mismo lead (identificado por el número de teléfono) no debería poder tener dos citas pendientes
Es decir que si quiere cambiar su cita debe cancelar la anterior



TABLAS

grupos
permisos
permiso_x_grupo
sedes

users:{
	email:,
	password:,
	primer_nombre:,
	segundo_nombre:,
	primer_apellido:,
	segundo_apellido:,
	sede_id:,
	grupo_id:,[vendedor|administrador]
}

leads:{
	email:,
	movil:,
	primer_nombre:,
	segundo_nombre:,
	primer_apellido:,
	segundo_apellido:,
	ciudad:,
	estado:, [ACTIVO,INACTIVO]
	n_citas_inasistidas,: //SERVIRÁ PARA SABER CUANDO ENVIAR A CALLCENTER
	eventos:[visita,registro,envio_crm,envio_email,envio_sms,envio_whatsup],
	observaciones:[]
}

eventos:[
	fecha:,
	tipo:,[agendo|cancelo|]
	ip:,
	user_agent:,
]

orientador:{
	id:,
	primer_nombre:,
	primer_apellido:,
	disponibilidad:["1T13:40:00","1T15:10:00","1T16:50:00","1T18:20:00","1T19:50:00","2T13:40:00","2T15:10:00","2T16:50:00","2T18:20:00","2T19:50:00","3T13:40:00","3T15:10:00","3T16:50:00","3T18:20:00","3T19:50:00","4T13:40:00","4T15:10:00","4T16:50:00","4T18:20:00","4T19:50:00","5T13:40:00","5T15:10:00","5T16:50:00","5T18:20:00","5T19:50:00","6T08:00:00","6T09:30:00","6T11:00:00","6T13:00:00","6T14:30:00"]
}

//estado de las sedes en cache - para mostrar la disponibilidad al cliente

//collection / en esta tabla va un registo por sede por día
disponibilidad_actual:[{
//document
	sede:1,
	dia:08-01-2020
	franjas:{
		'07:15:00'{
			orientadores:[
				{
					id:'orientador1',
					estado:'disponible'
				},
				{
					id:'orientador2',
					estado:'ocupado',
					lead:{
						id:ObjectID,
						primer_nombre:'Harold',
						primer_apellido:'Villota',
					}
				},
				{
					id:'orientador3',
					estado:'no_disponible'
				},
			],
			/**CALCULAR EN TIEMPO REAL
			//n_orientadores:3
			//capacidad:2,
			//disponibilidad:1,
			**/
		}
	}
}]
//collection - en esta tabla va un registo por sede por día
disponibilidad_historico:[{
//document
	sede:1,
	dia:08-01-2020
	franjas:{
			'07:15:00'{
				orientadores:[
					{
						id:'orientador1',
						estado:'disponible'
					},
					{
						id:'orientador2',
						estado:'ocupado',
						lead:{
							id:ObjectID,
							primer_nombre:'Harold',
							primer_apellido:'Villota',
						}
					},
					{
						id:'orientador3',
						estado:'no_disponible'
					},
				],
				/**CALCULAR EN TIEMPO REAL
				//n_orientadores:3
				//capacidad:2,
				//disponibilidad:1,
				**/
			}
		}
}]


citas:{
	lead_id:,
	sede_id:,
	vendedor_id:,
	fecha_cita:,
	estado:,[PENDIENTE,CANCELADA,ASISTIDA,INASISTIDA]
	eventos:[creada|cancelada|asistio|no_asistio]
	observaciones:[]
}


posibles eventos: 
leads:agendar|cancelar
vendedor:



1 - 7:15am
2 - 7:45am
3 - 8:15am
4 - 8:45am
5 - 9:15am
6 - 9:45am
7 - 10:15am
8 - 10:45am
9 - 11:15am
10 - 11:45am
11 - 12:15pm
12 - 12:45pm
13 - 1:15pm
14 - 1:45pm
15 - 2:15pm
16 - 2:45pm
17 - 3:15pm
18 - 3:45pm
19 - 4:15pm
20 - 4:45pm
21 - 5:15pm
22 - 5:45pm
23 - 6:15pm
24 - 6:45pm
25 - 7:15pm
26 - 7:45pm
27 - 8:15pm
