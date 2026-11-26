// Build with npm exec --yes --package esbuild@0.25.12 -- esbuild dist/research-routes.js
// --bundle --format=iife --global-name=ZhiceResearchRoutes --outfile=dist/research-routes.bundle.js
export { mountManagerList } from './manager-list.js';
export { renderManagerDetail } from './manager-detail.js';
export { getManagerListData } from './manager-list-data.js?v=20261126-period-conditions';
export { mountCompanyList } from './company-list.js';
export { mountCompanyDetail } from './company-detail.js';
