post /auth/login    
post /auth/register
post /auth/logout

get /admin/marketdata    for getting all fruit/veg data
post /admin/marketdata    for uploading fruit/veg data
put /admin/marketdata/:id     for updating fruit/veg data   body = {"price" : 90}
delete /admin/marketdata/:id     for deleting data