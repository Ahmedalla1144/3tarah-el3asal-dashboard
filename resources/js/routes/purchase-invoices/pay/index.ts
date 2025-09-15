import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PurchaseInvoiceController::form
* @see app/Http/Controllers/PurchaseInvoiceController.php:335
* @route '/purchase-invoices/{purchaseInvoice}/pay'
*/
export const form = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: form.url(args, options),
    method: 'get',
})

form.definition = {
    methods: ["get","head"],
    url: '/purchase-invoices/{purchaseInvoice}/pay',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::form
* @see app/Http/Controllers/PurchaseInvoiceController.php:335
* @route '/purchase-invoices/{purchaseInvoice}/pay'
*/
form.url = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return form.definition.url
            .replace('{purchaseInvoice}', parsedArgs.purchaseInvoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::form
* @see app/Http/Controllers/PurchaseInvoiceController.php:335
* @route '/purchase-invoices/{purchaseInvoice}/pay'
*/
form.get = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: form.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::form
* @see app/Http/Controllers/PurchaseInvoiceController.php:335
* @route '/purchase-invoices/{purchaseInvoice}/pay'
*/
form.head = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: form.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::form
* @see app/Http/Controllers/PurchaseInvoiceController.php:335
* @route '/purchase-invoices/{purchaseInvoice}/pay'
*/
const formForm = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: form.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::form
* @see app/Http/Controllers/PurchaseInvoiceController.php:335
* @route '/purchase-invoices/{purchaseInvoice}/pay'
*/
formForm.get = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: form.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseInvoiceController::form
* @see app/Http/Controllers/PurchaseInvoiceController.php:335
* @route '/purchase-invoices/{purchaseInvoice}/pay'
*/
formForm.head = (args: { purchaseInvoice: number | { id: number } } | [purchaseInvoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: form.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

form.form = formForm
