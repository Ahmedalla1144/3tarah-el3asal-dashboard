import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PurchaseInvoiceController::index
* @see app/Http/Controllers/PurchaseInvoiceController.php:32
* @route '/purchase-invoices'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/purchase-invoices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::index
* @see app/Http/Controllers/PurchaseInvoiceController.php:32
* @route '/purchase-invoices'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::index
* @see app/Http/Controllers/PurchaseInvoiceController.php:32
* @route '/purchase-invoices'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::index
* @see app/Http/Controllers/PurchaseInvoiceController.php:32
* @route '/purchase-invoices'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::index
* @see app/Http/Controllers/PurchaseInvoiceController.php:32
* @route '/purchase-invoices'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::index
* @see app/Http/Controllers/PurchaseInvoiceController.php:32
* @route '/purchase-invoices'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::index
* @see app/Http/Controllers/PurchaseInvoiceController.php:32
* @route '/purchase-invoices'
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
* @see \App\Http\Controllers\PurchaseInvoiceController::create
* @see app/Http/Controllers/PurchaseInvoiceController.php:71
* @route '/purchase-invoices/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/purchase-invoices/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::create
* @see app/Http/Controllers/PurchaseInvoiceController.php:71
* @route '/purchase-invoices/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::create
* @see app/Http/Controllers/PurchaseInvoiceController.php:71
* @route '/purchase-invoices/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::create
* @see app/Http/Controllers/PurchaseInvoiceController.php:71
* @route '/purchase-invoices/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::create
* @see app/Http/Controllers/PurchaseInvoiceController.php:71
* @route '/purchase-invoices/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::create
* @see app/Http/Controllers/PurchaseInvoiceController.php:71
* @route '/purchase-invoices/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::create
* @see app/Http/Controllers/PurchaseInvoiceController.php:71
* @route '/purchase-invoices/create'
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
* @see \App\Http\Controllers\PurchaseInvoiceController::store
* @see app/Http/Controllers/PurchaseInvoiceController.php:103
* @route '/purchase-invoices'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/purchase-invoices',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::store
* @see app/Http/Controllers/PurchaseInvoiceController.php:103
* @route '/purchase-invoices'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::store
* @see app/Http/Controllers/PurchaseInvoiceController.php:103
* @route '/purchase-invoices'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::store
* @see app/Http/Controllers/PurchaseInvoiceController.php:103
* @route '/purchase-invoices'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::store
* @see app/Http/Controllers/PurchaseInvoiceController.php:103
* @route '/purchase-invoices'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::show
* @see app/Http/Controllers/PurchaseInvoiceController.php:261
* @route '/purchase-invoices/{purchase_invoice}'
*/
export const show = (args: { purchase_invoice: string | number } | [purchase_invoice: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/purchase-invoices/{purchase_invoice}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::show
* @see app/Http/Controllers/PurchaseInvoiceController.php:261
* @route '/purchase-invoices/{purchase_invoice}'
*/
show.url = (args: { purchase_invoice: string | number } | [purchase_invoice: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchase_invoice: args }
    }

    if (Array.isArray(args)) {
        args = {
            purchase_invoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchase_invoice: args.purchase_invoice,
    }

    return show.definition.url
            .replace('{purchase_invoice}', parsedArgs.purchase_invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::show
* @see app/Http/Controllers/PurchaseInvoiceController.php:261
* @route '/purchase-invoices/{purchase_invoice}'
*/
show.get = (args: { purchase_invoice: string | number } | [purchase_invoice: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::show
* @see app/Http/Controllers/PurchaseInvoiceController.php:261
* @route '/purchase-invoices/{purchase_invoice}'
*/
show.head = (args: { purchase_invoice: string | number } | [purchase_invoice: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::show
* @see app/Http/Controllers/PurchaseInvoiceController.php:261
* @route '/purchase-invoices/{purchase_invoice}'
*/
const showForm = (args: { purchase_invoice: string | number } | [purchase_invoice: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::show
* @see app/Http/Controllers/PurchaseInvoiceController.php:261
* @route '/purchase-invoices/{purchase_invoice}'
*/
showForm.get = (args: { purchase_invoice: string | number } | [purchase_invoice: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::show
* @see app/Http/Controllers/PurchaseInvoiceController.php:261
* @route '/purchase-invoices/{purchase_invoice}'
*/
showForm.head = (args: { purchase_invoice: string | number } | [purchase_invoice: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PurchaseInvoiceController::print
* @see app/Http/Controllers/PurchaseInvoiceController.php:296
* @route '/purchase-invoices/{purchaseInvoice}/print'
*/
export const print = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/purchase-invoices/{purchaseInvoice}/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::print
* @see app/Http/Controllers/PurchaseInvoiceController.php:296
* @route '/purchase-invoices/{purchaseInvoice}/print'
*/
print.url = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseInvoice: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseInvoice: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseInvoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseInvoice: typeof args.purchaseInvoice === 'object'
        ? args.purchaseInvoice.id
        : args.purchaseInvoice,
    }

    return print.definition.url
            .replace('{purchaseInvoice}', parsedArgs.purchaseInvoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::print
* @see app/Http/Controllers/PurchaseInvoiceController.php:296
* @route '/purchase-invoices/{purchaseInvoice}/print'
*/
print.get = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::print
* @see app/Http/Controllers/PurchaseInvoiceController.php:296
* @route '/purchase-invoices/{purchaseInvoice}/print'
*/
print.head = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::print
* @see app/Http/Controllers/PurchaseInvoiceController.php:296
* @route '/purchase-invoices/{purchaseInvoice}/print'
*/
const printForm = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::print
* @see app/Http/Controllers/PurchaseInvoiceController.php:296
* @route '/purchase-invoices/{purchaseInvoice}/print'
*/
printForm.get = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::print
* @see app/Http/Controllers/PurchaseInvoiceController.php:296
* @route '/purchase-invoices/{purchaseInvoice}/print'
*/
printForm.head = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PurchaseInvoiceController::pay
* @see app/Http/Controllers/PurchaseInvoiceController.php:357
* @route '/purchase-invoices/{purchaseInvoice}/pay'
*/
export const pay = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(args, options),
    method: 'post',
})

pay.definition = {
    methods: ["post"],
    url: '/purchase-invoices/{purchaseInvoice}/pay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::pay
* @see app/Http/Controllers/PurchaseInvoiceController.php:357
* @route '/purchase-invoices/{purchaseInvoice}/pay'
*/
pay.url = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseInvoice: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseInvoice: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseInvoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseInvoice: typeof args.purchaseInvoice === 'object'
        ? args.purchaseInvoice.id
        : args.purchaseInvoice,
    }

    return pay.definition.url
            .replace('{purchaseInvoice}', parsedArgs.purchaseInvoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::pay
* @see app/Http/Controllers/PurchaseInvoiceController.php:357
* @route '/purchase-invoices/{purchaseInvoice}/pay'
*/
pay.post = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::pay
* @see app/Http/Controllers/PurchaseInvoiceController.php:357
* @route '/purchase-invoices/{purchaseInvoice}/pay'
*/
const payForm = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pay.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::pay
* @see app/Http/Controllers/PurchaseInvoiceController.php:357
* @route '/purchase-invoices/{purchaseInvoice}/pay'
*/
payForm.post = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pay.url(args, options),
    method: 'post',
})

pay.form = payForm

const purchaseInvoices = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    print: Object.assign(print, print),
    pay: Object.assign(pay, pay),
}

export default purchaseInvoices