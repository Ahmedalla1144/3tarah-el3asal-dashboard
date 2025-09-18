import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\SalesInvoiceController::index
* @see app/Http/Controllers/SalesInvoiceController.php:33
* @route '/sales-invoices'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/sales-invoices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SalesInvoiceController::index
* @see app/Http/Controllers/SalesInvoiceController.php:33
* @route '/sales-invoices'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalesInvoiceController::index
* @see app/Http/Controllers/SalesInvoiceController.php:33
* @route '/sales-invoices'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::index
* @see app/Http/Controllers/SalesInvoiceController.php:33
* @route '/sales-invoices'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::index
* @see app/Http/Controllers/SalesInvoiceController.php:33
* @route '/sales-invoices'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::index
* @see app/Http/Controllers/SalesInvoiceController.php:33
* @route '/sales-invoices'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::index
* @see app/Http/Controllers/SalesInvoiceController.php:33
* @route '/sales-invoices'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\SalesInvoiceController::create
* @see app/Http/Controllers/SalesInvoiceController.php:67
* @route '/sales-invoices/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/sales-invoices/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SalesInvoiceController::create
* @see app/Http/Controllers/SalesInvoiceController.php:67
* @route '/sales-invoices/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalesInvoiceController::create
* @see app/Http/Controllers/SalesInvoiceController.php:67
* @route '/sales-invoices/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::create
* @see app/Http/Controllers/SalesInvoiceController.php:67
* @route '/sales-invoices/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::create
* @see app/Http/Controllers/SalesInvoiceController.php:67
* @route '/sales-invoices/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::create
* @see app/Http/Controllers/SalesInvoiceController.php:67
* @route '/sales-invoices/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::create
* @see app/Http/Controllers/SalesInvoiceController.php:67
* @route '/sales-invoices/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\SalesInvoiceController::store
* @see app/Http/Controllers/SalesInvoiceController.php:100
* @route '/sales-invoices'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/sales-invoices',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SalesInvoiceController::store
* @see app/Http/Controllers/SalesInvoiceController.php:100
* @route '/sales-invoices'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalesInvoiceController::store
* @see app/Http/Controllers/SalesInvoiceController.php:100
* @route '/sales-invoices'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::store
* @see app/Http/Controllers/SalesInvoiceController.php:100
* @route '/sales-invoices'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::store
* @see app/Http/Controllers/SalesInvoiceController.php:100
* @route '/sales-invoices'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\SalesInvoiceController::show
* @see app/Http/Controllers/SalesInvoiceController.php:289
* @route '/sales-invoices/{sales_invoice}'
*/
export const show = (args: { sales_invoice: string | number } | [sales_invoice: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/sales-invoices/{sales_invoice}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SalesInvoiceController::show
* @see app/Http/Controllers/SalesInvoiceController.php:289
* @route '/sales-invoices/{sales_invoice}'
*/
show.url = (args: { sales_invoice: string | number } | [sales_invoice: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sales_invoice: args }
    }

    if (Array.isArray(args)) {
        args = {
            sales_invoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sales_invoice: args.sales_invoice,
    }

    return show.definition.url
            .replace('{sales_invoice}', parsedArgs.sales_invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalesInvoiceController::show
* @see app/Http/Controllers/SalesInvoiceController.php:289
* @route '/sales-invoices/{sales_invoice}'
*/
show.get = (args: { sales_invoice: string | number } | [sales_invoice: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::show
* @see app/Http/Controllers/SalesInvoiceController.php:289
* @route '/sales-invoices/{sales_invoice}'
*/
show.head = (args: { sales_invoice: string | number } | [sales_invoice: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::show
* @see app/Http/Controllers/SalesInvoiceController.php:289
* @route '/sales-invoices/{sales_invoice}'
*/
const showForm = (args: { sales_invoice: string | number } | [sales_invoice: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::show
* @see app/Http/Controllers/SalesInvoiceController.php:289
* @route '/sales-invoices/{sales_invoice}'
*/
showForm.get = (args: { sales_invoice: string | number } | [sales_invoice: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::show
* @see app/Http/Controllers/SalesInvoiceController.php:289
* @route '/sales-invoices/{sales_invoice}'
*/
showForm.head = (args: { sales_invoice: string | number } | [sales_invoice: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\SalesInvoiceController::print
* @see app/Http/Controllers/SalesInvoiceController.php:410
* @route '/sales-invoices/{salesInvoice}/print'
*/
export const print = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/sales-invoices/{salesInvoice}/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SalesInvoiceController::print
* @see app/Http/Controllers/SalesInvoiceController.php:410
* @route '/sales-invoices/{salesInvoice}/print'
*/
print.url = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { salesInvoice: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { salesInvoice: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            salesInvoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        salesInvoice: typeof args.salesInvoice === 'object'
        ? args.salesInvoice.id
        : args.salesInvoice,
    }

    return print.definition.url
            .replace('{salesInvoice}', parsedArgs.salesInvoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalesInvoiceController::print
* @see app/Http/Controllers/SalesInvoiceController.php:410
* @route '/sales-invoices/{salesInvoice}/print'
*/
print.get = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::print
* @see app/Http/Controllers/SalesInvoiceController.php:410
* @route '/sales-invoices/{salesInvoice}/print'
*/
print.head = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::print
* @see app/Http/Controllers/SalesInvoiceController.php:410
* @route '/sales-invoices/{salesInvoice}/print'
*/
const printForm = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::print
* @see app/Http/Controllers/SalesInvoiceController.php:410
* @route '/sales-invoices/{salesInvoice}/print'
*/
printForm.get = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::print
* @see app/Http/Controllers/SalesInvoiceController.php:410
* @route '/sales-invoices/{salesInvoice}/print'
*/
printForm.head = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

print.form = printForm

/**
* @see \App\Http\Controllers\SalesInvoiceController::pay
* @see app/Http/Controllers/SalesInvoiceController.php:366
* @route '/sales-invoices/{salesInvoice}/pay'
*/
export const pay = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(args, options),
    method: 'post',
})

pay.definition = {
    methods: ["post"],
    url: '/sales-invoices/{salesInvoice}/pay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SalesInvoiceController::pay
* @see app/Http/Controllers/SalesInvoiceController.php:366
* @route '/sales-invoices/{salesInvoice}/pay'
*/
pay.url = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { salesInvoice: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { salesInvoice: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            salesInvoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        salesInvoice: typeof args.salesInvoice === 'object'
        ? args.salesInvoice.id
        : args.salesInvoice,
    }

    return pay.definition.url
            .replace('{salesInvoice}', parsedArgs.salesInvoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalesInvoiceController::pay
* @see app/Http/Controllers/SalesInvoiceController.php:366
* @route '/sales-invoices/{salesInvoice}/pay'
*/
pay.post = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::pay
* @see app/Http/Controllers/SalesInvoiceController.php:366
* @route '/sales-invoices/{salesInvoice}/pay'
*/
const payForm = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pay.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::pay
* @see app/Http/Controllers/SalesInvoiceController.php:366
* @route '/sales-invoices/{salesInvoice}/pay'
*/
payForm.post = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pay.url(args, options),
    method: 'post',
})

pay.form = payForm

const salesInvoices = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    print: Object.assign(print, print),
    pay: Object.assign(pay, pay),
}

export default salesInvoices