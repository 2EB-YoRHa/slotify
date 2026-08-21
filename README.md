# Slotify — Sistema de reservas para coworking (MicroSaaS)

## Descripción

Slotify es una aplicación web tipo SaaS enfocada en la gestión de reservas de espacios de coworking. Permite que múltiples empresas (coworkings) puedan administrar sus propios espacios de trabajo, mientras que los usuarios pueden registrarse, consultar disponibilidad y realizar reservas según fecha y hora.

El sistema está diseñado como una solución multiempresa, donde cada organización gestiona sus propios datos de forma independiente dentro de la misma plataforma.

---

## Live Demo

Slotify se encuentra desplegado en **Render** y puede probarse directamente desde el navegador.

**Aplicación desplegada:**
`PENDIENTE: agregar URL pública de Render`

> **Nota:** si el servicio de Render se encuentra inactivo, la primera carga puede tardar algunos segundos mientras la aplicación vuelve a iniciar.

Las cuentas disponibles para probar los diferentes flujos de la aplicación se encuentran en la sección **Cuentas de prueba** de este README.

---

## Video de presentación

Se preparó un video de presentación y demostración de Slotify donde se muestra el funcionamiento completo de la aplicación.

El video incluye, entre otros flujos:

* Creación de cuentas.
* Confirmación de correo electrónico.
* Recuperación de contraseña.
* Manejo de cuentas sin confirmar.
* Manejo de cuentas inactivas.
* Autenticación con Two-Factor Authentication (2FA).
* Administración de organizaciones.
* Gestión de miembros.
* Invitaciones por correo.
* Gestión de amenities.
* Creación y administración de workspaces.
* Booking Rules.
* Custom Time Slots.
* Creación, edición y cancelación de reservas.
* Validación de disponibilidad.
* Prevención de reservas solapadas.
* Experiencia del rol Member.
* Suscripción al plan Starter.
* Upgrade de Starter a Pro.
* Integración con Stripe.
* Restricciones por plan.
* Escenario de downgrade de Pro a Starter excediendo los límites del nuevo plan.
* Diseño responsive y experiencia de usuario.

**Video de presentación:**
`PENDIENTE: agregar URL del video`

---

## Cuentas de prueba

Las siguientes cuentas fueron creadas exclusivamente para probar los diferentes roles, estados, planes y reglas de negocio de Slotify.

### Contraseña

Todas las cuentas de prueba utilizan la siguiente contraseña:

```text
Password123!
```

### Accounts

| Escenario               | Correo                            | Uso principal                                                                                 |
| ----------------------- | --------------------------------- | --------------------------------------------------------------------------------------------- |
| Manager — Pro           | `manager@slotify.test`            | Probar el flujo completo de administración de una organización con plan Pro                   |
| Member — Pro            | `member@slotify.test`             | Probar la experiencia del rol Member, workspaces y reservas                                   |
| Member inactivo         | `inactive-member@slotify.test`    | Probar el bloqueo de acceso de una cuenta desactivada                                         |
| Member sin confirmar    | `unconfirmed-member@slotify.test` | Probar el comportamiento de una cuenta que todavía no ha confirmado su correo                 |
| Manager — Starter       | `starter-manager@slotify.test`    | Probar los límites y funcionalidades disponibles en el plan Starter                           |
| Member — Starter        | `starter-member@slotify.test`     | Probar la experiencia de Member dentro de una organización con plan Starter                   |
| Manager — Pro → Starter | `downgraded-manager@slotify.test` | Probar una organización que anteriormente utilizaba Pro y ahora excede los límites de Starter |

### Escenario Pro → Starter

La cuenta:

```text
downgraded-manager@slotify.test
```

pertenece a una organización que anteriormente utilizaba el plan **Pro** y posteriormente realizó un downgrade al plan **Starter**.

Mientras utilizaba Pro, la organización creó más recursos de los permitidos por Starter.

Después del downgrade, Slotify **no elimina automáticamente los datos existentes**.

En cambio, conserva los recursos creados anteriormente y aplica las restricciones del nuevo plan a futuras acciones.

Este escenario permite comprobar que Slotify:

* Conserva los datos existentes después de un downgrade.
* Detecta cuando una organización excede los límites de su plan actual.
* Mantiene accesibles los workspaces existentes.
* Mantiene los usuarios existentes.
* Bloquea la creación de nuevos workspaces cuando se supera el límite permitido.
* Bloquea nuevas invitaciones cuando se supera el límite de usuarios.
* Permite regresar a un plan superior para recuperar la capacidad de crecimiento.

> Estas credenciales existen únicamente con fines de demostración y testing.

---

## Objetivo del proyecto

El objetivo es desarrollar una aplicación completa utilizando Ruby on Rails como backend y React (Vite + Inertia) como frontend, aplicando conceptos como arquitectura MVC, autenticación, autorización, modelado de base de datos, testing y despliegue.

---

## Problema que se busca resolver

En muchos casos, la gestión de reservas en espacios de coworking se realiza de forma manual o con herramientas poco eficientes, lo que puede generar:

* Conflictos de horarios.
* Mala organización de los espacios.
* Falta de control sobre las reservas.
* Dificultad para consultar disponibilidad.

Slotify busca centralizar este proceso en una sola plataforma, permitiendo a cada empresa gestionar sus espacios de forma ordenada y eficiente.

---

## Modelo de negocio

Slotify funciona bajo un modelo SaaS, donde cada empresa de coworking puede suscribirse a la plataforma para gestionar sus espacios, usuarios y reservas.

El cliente principal de Slotify es la organización de coworking.

Los miembros utilizan la plataforma dentro de la organización a la que pertenecen, mientras que la organización es responsable de su suscripción.

Los planes de suscripción también controlan límites y funcionalidades disponibles dentro de la aplicación.

---

## Tecnologías utilizadas

### Backend

* Ruby on Rails
* PostgreSQL
* Devise
* Active Storage
* ActionMailer
* ROTP
* Stripe

### Frontend

* React
* TypeScript
* Vite
* Inertia.js
* Tailwind CSS
* Motion
* Lucide React

### Deployment e integraciones

* Render
* PostgreSQL
* Stripe Checkout
* Stripe Customer Portal
* Stripe Webhooks
* SendGrid

---

## Arquitectura

Slotify utiliza Ruby on Rails como backend principal.

Rails se encarga de:

* Routing.
* Models.
* Controllers.
* Validaciones.
* Autenticación.
* Autorización.
* Reglas de negocio.
* Reservas.
* Suscripciones.
* Integraciones externas.

React con TypeScript se utiliza para construir la interfaz de usuario.

Inertia.js funciona como puente entre Rails y React, permitiendo obtener una experiencia similar a una SPA sin necesidad de mantener una API REST independiente para esta versión del proyecto.

PostgreSQL almacena los datos relacionales de la aplicación.

---

## Modelos principales

Entre los principales modelos del sistema se encuentran:

* User
* Role
* Organization
* Workspace
* Amenity
* Reservation
* BookingRule
* TimeSlot
* Subscription
* Payment
* OrganizationInvitation

---

## Roles del sistema

### Manager

El Manager administra una organización de coworking.

Puede gestionar:

* Workspaces.
* Amenities.
* Booking Rules.
* Custom Time Slots.
* Miembros.
* Invitaciones.
* Reservas.
* Información de suscripción.
* Configuración de la organización.

### Member

El Member utiliza Slotify principalmente para reservar espacios.

Puede:

* Consultar workspaces activos.
* Revisar información de los espacios.
* Consultar disponibilidad.
* Crear reservas.
* Editar sus propias reservas cuando las reglas lo permiten.
* Cancelar sus propias reservas cuando las políticas lo permiten.
* Consultar su historial de reservas.
* Administrar su perfil y seguridad.

---

## Autenticación y seguridad

Slotify utiliza **Devise** para administrar la autenticación.

La aplicación incluye:

* Sign Up.
* Sign In.
* Sign Out.
* Confirmación de correo electrónico.
* Recuperación de contraseña.
* Manejo de cuentas inactivas.
* Validaciones de contraseña.
* Two-Factor Authentication.

La autenticación de dos factores utiliza códigos de un solo uso generados mediante aplicaciones de autenticación compatibles con TOTP.

---

## Organización y multi-tenancy

Slotify utiliza una arquitectura basada en organizaciones.

Cada coworking funciona como una organización independiente dentro de la misma aplicación.

Los principales recursos están asociados a una organización, incluyendo:

* Users.
* Workspaces.
* Reservations.
* Booking Rules.
* Time Slots.
* Invitations.
* Subscriptions.

Esto permite que múltiples organizaciones utilicen Slotify manteniendo sus datos separados.

---

## Workspaces y Amenities

Los Managers pueden crear y administrar los espacios disponibles dentro de su coworking.

Cada workspace puede incluir información como:

* Nombre.
* Tipo.
* Capacidad.
* Piso.
* Zona.
* Ubicación.
* Descripción.
* Precio por hora.
* Estado activo o inactivo.
* Amenities.
* Imagen principal.
* Galería de imágenes según el plan.

Los Amenities son reutilizables y pueden asignarse a múltiples workspaces.

---

## Sistema de reservas

Slotify permite crear reservas para los workspaces disponibles.

Antes de guardar una reserva, el backend valida diferentes reglas de negocio.

Entre ellas:

* El workspace debe pertenecer a la organización correspondiente.
* El workspace debe estar activo.
* La cantidad de asistentes no puede superar la capacidad.
* La hora final debe ser posterior a la hora inicial.
* La reserva debe cumplir las Booking Rules.
* La reserva debe respetar Custom Time Slots cuando correspondan.
* El workspace debe estar disponible.
* No puede existir otra reserva confirmada que se solape con el mismo horario.

### Prevención de reservas solapadas

Slotify considera que dos reservas se solapan cuando:

```text
existing_start < new_end
AND
existing_end > new_start
```

Esto permite reservas consecutivas.

Por ejemplo:

```text
09:00 - 10:00
10:00 - 11:00
```

son válidas.

Mientras que:

```text
09:00 - 11:00
10:00 - 12:00
```

representan un conflicto.

---

## Booking Rules

Cada organización puede definir políticas para controlar cómo se realizan las reservas.

Entre ellas:

* Máximo de horas por reserva.
* Tiempo mínimo de anticipación.
* Límite para cancelar reservas.
* Reservas durante fines de semana.

Estas reglas se validan en el backend al crear o modificar una reserva.

---

## Custom Time Slots

Las organizaciones con acceso a esta funcionalidad pueden definir bloques de horario reutilizables.

Por ejemplo:

* Morning Session.
* Afternoon Session.
* Weekend Session.

Esto permite que un coworking controle de forma más estricta los horarios disponibles para reservar determinados espacios.

---

## Suscripciones

Slotify utiliza Stripe para administrar el flujo de suscripciones.

### Stripe Checkout

Cuando una organización todavía no posee una suscripción activa, Slotify puede crear una sesión de **Stripe Checkout** para activar un plan.

### Stripe Customer Portal

Las organizaciones que ya poseen una suscripción pueden utilizar **Stripe Customer Portal** para administrar su facturación y cambios de plan.

### Stripe Webhooks

Stripe Webhooks permiten sincronizar eventos del ciclo de vida de las suscripciones con Slotify.

La aplicación utiliza el estado de la suscripción para controlar límites y funcionalidades.

---

## Planes

Slotify cuenta con diferentes niveles de suscripción.

### Starter

Incluye las funcionalidades principales para administrar una organización de coworking, pero establece límites sobre determinados recursos y funcionalidades.

### Pro

Amplía las capacidades de la aplicación y permite acceso a funcionalidades como:

* Custom Time Slots.
* Advanced Booking Rules.
* Usage Insights.
* Availability Command Center.
* Multiple Workspace Photos.
* Mayores límites de recursos.

---

## Casos de uso principales

1. Registro de Manager y organización.
2. Confirmación de cuenta.
3. Inicio de sesión.
4. Recuperación de contraseña.
5. Two-Factor Authentication.
6. Manejo de cuentas inactivas.
7. Invitación de miembros.
8. Registro de Member mediante invitación.
9. Administración de organización.
10. Administración de Amenities.
11. Administración de Workspaces.
12. Validación de disponibilidad.
13. Creación de reservas.
14. Edición de reservas.
15. Cancelación de reservas.
16. Consulta del historial.
17. Booking Rules.
18. Custom Time Slots.
19. Suscripción mediante Stripe.
20. Upgrade de plan.
21. Downgrade de plan.
22. Aplicación de límites según suscripción.

---

## Interfaz y experiencia de usuario

La interfaz de Slotify fue desarrollada con React y TypeScript.

Entre las características de experiencia de usuario se incluyen:

* Diseño responsive.
* Dark Mode.
* Loading skeletons.
* Toast notifications.
* Confirmation dialogs.
* Empty states.
* Animaciones y transiciones.
* Componentes reutilizables.
* Interfaces diferenciadas para Manager y Member.

---

## Deployment

Slotify se encuentra desplegado en **Render** utilizando PostgreSQL como base de datos.

La configuración sensible se administra mediante variables de entorno, incluyendo información como:

* Database URL.
* Rails Secret Key Base.
* Stripe credentials.
* Email provider credentials.

Los secretos y credenciales de producción no deben almacenarse directamente dentro del código fuente.

---

## Checklist del proyecto

* [x] Tiene autenticación
* [x] Tiene autorización por roles
* [x] Tiene mínimo 5 modelos
* [x] Tiene mínimo 6 casos de uso
* [x] Usa Rails como backend
* [x] Usa React como frontend
* [x] Tiene base de datos relacional
* [x] Tiene CRUD funcional
* [x] Tiene validaciones
* [x] Tiene pruebas automatizadas
* [x] Tiene README
* [x] Tiene presentación final

---

## Estado del proyecto

Proyecto final desarrollado como **MicroSaaS para la gestión de reservas de espacios de coworking**.

Slotify integra frontend, backend, base de datos, autenticación, autorización, reglas de negocio, sistema de reservas, suscripciones y despliegue en una sola aplicación.
