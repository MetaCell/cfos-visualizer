ARG NODE_PARENT=node:20

FROM  ${NODE_PARENT} as frontend

ENV BUILDDIR=/app

WORKDIR ${BUILDDIR}
COPY client/package.json ${BUILDDIR}
COPY client/package-lock.json ${BUILDDIR}
COPY nginx/default.conf ${BUILDDIR}

RUN npm install  --legacy-peer-deps
COPY ./client/ ${BUILDDIR}
RUN npx update-browserslist-db@latest
RUN npm run build

FROM nginx:1.19.3-alpine

RUN cat /etc/nginx/conf.d/default.conf

COPY --from=frontend /app/default.conf  /etc/nginx/conf.d/default.conf

COPY --from=frontend /app/build /usr/share/nginx/html/

EXPOSE 80
