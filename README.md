# Slotify — Sistema de reservas para coworking (MicroSaaS)

## Descripción

Slotify es una aplicación web tipo SaaS enfocada en la gestión de reservas de espacios de coworking. Permite que múltiples empresas (coworkings) puedan administrar sus propios espacios de trabajo, mientras que los usuarios pueden registrarse, consultar disponibilidad y realizar reservas según fecha y hora.

El sistema está diseñado como una solución multiempresa, donde cada organización gestiona sus propios datos de forma independiente dentro de la misma plataforma.

---

## Objetivo del proyecto

El objetivo es desarrollar una aplicación completa utilizando Ruby on Rails como backend y React (Vite + Inertia) como frontend, aplicando conceptos como arquitectura MVC, autenticación, autorización, modelado de base de datos, testing y despliegue.

---

## Problema que se busca resolver

En muchos casos, la gestión de reservas en espacios de coworking se realiza de forma manual o con herramientas poco eficientes, lo que puede generar:

- Conflictos de horarios  
- Mala organización de los espacios  
- Falta de control sobre las reservas  
- Dificultad para consultar disponibilidad  

Slotify busca centralizar este proceso en una sola plataforma, permitiendo a cada empresa gestionar sus espacios de forma ordenada y eficiente.

---

## Modelo de negocio

Slotify funcionará bajo un modelo SaaS, donde cada empresa (coworking) podrá suscribirse a la plataforma para gestionar sus espacios y reservas.

Los usuarios finales utilizarán el sistema dentro de la organización a la que pertenecen, mientras que la empresa será la responsable de la suscripción.

---

## Tecnologías a utilizar

- Ruby on Rails  
- React  
- Vite  
- Inertia  
- PostgreSQL  

---

## Modelos principales

- User  
- Role  
- Organization  
- Workspace  
- Reservation  
- Subscription  

---

## Roles del sistema

- Admin: administra toda la plataforma  
- Coworking Owner / Manager: administra su organización, espacios y reservas  
- Member: realiza reservas dentro de su organización  

---

## Casos de uso

1. Registro de usuarios  
2. Inicio de sesión  
3. Crear una reserva  
4. Validar disponibilidad de espacios  
5. Cancelar una reserva  
6. Ver historial de reservas  
7. Administración de espacios por parte del manager  
8. Gestión de la organización (usuarios y espacios)  
9. Visualización básica de ocupación de espacios  

---

## Checklist del proyecto

[ ] Tiene autenticación  
[ ] Tiene autorización por roles  
[ ] Tiene mínimo 5 modelos  
[ ] Tiene mínimo 6 casos de uso  
[ ] Usa Rails como backend  
[ ] Usa React como frontend  
[ ] Tiene base de datos relacional  
[ ] Tiene CRUD funcional  
[ ] Tiene validaciones  
[ ] Tiene pruebas automatizadas  
[ ] Tiene README  
[ ] Tiene presentación final  

---

## Estado del proyecto

Semana 1 - Definición inicial del proyecto
Semana 2 - Sketches del proyecto
