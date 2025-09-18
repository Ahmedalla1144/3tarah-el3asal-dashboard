import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SalesInvoiceController::form
* @see app/Http/Controllers/SalesInvoiceController.php:267
* @route '/sales-invoices/{salesInvoice}/pay'
*/
export const form = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: form.url(args, options),
    method: 'get',
})

form.definition = {
    methods: ["get","head"],
    url: '/sales-invoices/{salesInvoice}/pay',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SalesInvoiceController::form
* @see app/Http/Controllers/SalesInvoiceController.php:267
* @route '/sales-invoices/{salesInvoice}/pay'
*/
form.url = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return form.definition.url
            .replace('{salesInvoice}', parsedArgs.salesInvoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalesInvoiceController::form
* @see app/Http/Controllers/SalesInvoiceController.php:267
* @route '/sales-invoices/{salesInvoice}/pay'
*/
form.get = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: form.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::form
* @see app/Http/Controllers/SalesInvoiceController.php:267
* @route '/sales-invoices/{salesInvoice}/pay'
*/
form.head = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: form.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::form
* @see app/Http/Controllers/SalesInvoiceController.php:267
* @route '/sales-invoices/{salesInvoice}/pay'
*/
const formForm = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: form.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::form
* @see app/Http/Controllers/SalesInvoiceController.php:267
* @route '/sales-invoices/{salesInvoice}/pay'
*/
formForm.get = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: form.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesInvoiceController::form
* @see app/Http/Controllers/SalesInvoiceController.php:267
* @route '/sales-invoices/{salesInvoice}/pay'
*/
formForm.head = (args: { salesInvoice: number | { id: number } } | [salesInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: form.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

form.form = formForm
