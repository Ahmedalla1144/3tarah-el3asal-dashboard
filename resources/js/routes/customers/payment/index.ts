import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CustomerPaymentController::create
* @see app/Http/Controllers/CustomerPaymentController.php:23
* @route '/customers/{customer}/payment'
*/
export const create = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/customers/{customer}/payment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerPaymentController::create
* @see app/Http/Controllers/CustomerPaymentController.php:23
* @route '/customers/{customer}/payment'
*/
create.url = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { customer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            customer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customer: typeof args.customer === 'object'
        ? args.customer.id
        : args.customer,
    }

    return create.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerPaymentController::create
* @see app/Http/Controllers/CustomerPaymentController.php:23
* @route '/customers/{customer}/payment'
*/
create.get = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerPaymentController::create
* @see app/Http/Controllers/CustomerPaymentController.php:23
* @route '/customers/{customer}/payment'
*/
create.head = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CustomerPaymentController::create
* @see app/Http/Controllers/CustomerPaymentController.php:23
* @route '/customers/{customer}/payment'
*/
const createForm = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerPaymentController::create
* @see app/Http/Controllers/CustomerPaymentController.php:23
* @route '/customers/{customer}/payment'
*/
createForm.get = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerPaymentController::create
* @see app/Http/Controllers/CustomerPaymentController.php:23
* @route '/customers/{customer}/payment'
*/
createForm.head = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\CustomerPaymentController::store
* @see app/Http/Controllers/CustomerPaymentController.php:55
* @route '/customers/{customer}/payment'
*/
export const store = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/customers/{customer}/payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CustomerPaymentController::store
* @see app/Http/Controllers/CustomerPaymentController.php:55
* @route '/customers/{customer}/payment'
*/
store.url = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { customer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            customer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customer: typeof args.customer === 'object'
        ? args.customer.id
        : args.customer,
    }

    return store.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerPaymentController::store
* @see app/Http/Controllers/CustomerPaymentController.php:55
* @route '/customers/{customer}/payment'
*/
store.post = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CustomerPaymentController::store
* @see app/Http/Controllers/CustomerPaymentController.php:55
* @route '/customers/{customer}/payment'
*/
const storeForm = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CustomerPaymentController::store
* @see app/Http/Controllers/CustomerPaymentController.php:55
* @route '/customers/{customer}/payment'
*/
storeForm.post = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const payment = {
    create: Object.assign(create, create),
    store: Object.assign(store, store),
}

export default payment