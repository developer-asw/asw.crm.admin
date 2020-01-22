# HISTORIAS DE USUARIO
## Administrador - Gestión de usuarios, roles y permisos
## OK - Administrador - Gestión de sedes
## Administrador - Gestión de vendedores
## Administrador - Agenda
## OK - Administrador - Gestión de plantillas
## Landing Page - Registro de leads
## Vendedor - Citas
## Administrador - Gestión de leads
## OK - Automatización - Confirmación de citas
## Automatización - Recordatorio de cita
## Automatización - Solicitud de reagendamiento
## Automatización - Envío a CRM
## OK - Automatización - Respuesta de WA automática

asw-leads-admin.extandar.com (asw-leads-admin)
asw-leads.extandar.com/api (asw-leads-api)
asw-leads.extandar.com (landing) (asw-leads-landing)

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
	estado:, [ACTIVO,INACTIVO],
	proceso:nuevo,
	n_citas_inasistidas,: //SERVIRÁ PARA SABER CUANDO ENVIAR A CALLCENTER
	eventos:[visita,registro,envio_crm,envio_email,envio_sms,envio_whatsup],
	observaciones:[]
}

proceso:

registro_incompleto
registro_completo
agendado_primera_vez
esperando_segunda_cita


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
	sede_id:1,
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


///por definir si necesitamos las citas en 
citas:{
	lead_id:,
	sede_id:,
	vendedor_id:,
	fecha_cita:,
	estado:,[PENDIENTE,CANCELADA,ASISTIDA,INASISTIDA]
	eventos:[creada|cancelada|asistio|no_asistio]
	observaciones:[]
}

plantillas:{
	codigo:'',//['confirmacion_primera_cita'
				|'recordatorio_dia_siguiente'
				|'recordatorio_una_hora'
				|'invitacion_segunda_cita'
				|'invitacion_tercera_cita']
	canal:'',//['email'|'whatsapp'|'sms'],
	datos:{
		[subject],
		[texto],
		[html],
	}
}
posibles eventos: 
leads:agendar|cancelar
vendedor:


Tu cita queda confirmada para el día {{dia}} a las {{hora}} en la sede {{sede}} ubicada en la dirección {{direccion}}. Te esperamos.


 7:15am - 7:45am		7:15:00
 7:45am - 8:15am		7:45:00
 8:15am - 8:45am		8:15:00
 8:45am - 9:15am		8:45:00
 9:15am - 9:45am		9:15:00
 9:45am - 10:15am		9:45:00
 10:15am - 10:45am		10:15:00
 10:45am - 11:15am		10:45:00
 11:15am - 11:45am		11:15:00
 11:45am - 12:15pm		11:45:00
 12:15pm - 12:45pm		12:15:00
 12:45pm - 1:15pm		12:45:00
 1:15pm - 1:45pm		13:15:00
 1:45pm - 2:15pm		13:45:00
 2:15pm - 2:45pm		14:15:00
 2:45pm - 3:15pm		14:45:00
 3:15pm - 3:45pm		15:15:00
 3:45pm - 4:15pm		15:45:00
 4:15pm - 4:45pm		16:15:00
 4:45pm - 5:15pm		16:45:00
 5:15pm - 5:45pm		17:15:00
 5:45pm - 6:15pm		17:45:00
 6:15pm - 6:45pm		18:15:00
 6:45pm - 7:15pm		18:45:00
 7:15pm - 7:45pm		19:15:00
 7:45pm - 8:15pm		19:45:00
 8:15pm - 8:45pm		20:15:00
 


NO RESTRINGIR CUPOS
ME DAN ACCESO A WORDPRES



