import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductUnitController::index
* @see app/Http/Controllers/ProductUnitController.php:18
* @route '/products/{product}/units'
*/
export const index = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/products/{product}/units',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductUnitController::index
* @see app/Http/Controllers/ProductUnitController.php:18
* @route '/products/{product}/units'
*/
index.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { product: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: typeof args.product === 'object'
        ? args.product.id
        : args.product,
    }

    return index.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductUnitController::index
* @see app/Http/Controllers/ProductUnitController.php:18
* @route '/products/{product}/units'
*/
index.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductUnitController::index
* @see app/Http/Controllers/ProductUnitController.php:18
* @route '/products/{product}/units'
*/
index.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProductUnitController::index
* @see app/Http/Controllers/ProductUnitController.php:18
* @route '/products/{product}/units'
*/
const indexForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductUnitController::index
* @see app/Http/Controllers/ProductUnitController.php:18
* @route '/products/{product}/units'
*/
indexForm.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductUnitController::index
* @see app/Http/Controllers/ProductUnitController.php:18
* @route '/products/{product}/units'
*/
indexForm.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\ProductUnitController::store
* @see app/Http/Controllers/ProductUnitController.php:48
* @route '/products/{product}/units'
*/
export const store = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/products/{product}/units',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductUnitController::store
* @see app/Http/Controllers/ProductUnitController.php:48
* @route '/products/{product}/units'
*/
store.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { product: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: typeof args.product === 'object'
        ? args.product.id
        : args.product,
    }

    return store.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductUnitController::store
* @see app/Http/Controllers/ProductUnitController.php:48
* @route '/products/{product}/units'
*/
store.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProductUnitController::store
* @see app/Http/Controllers/ProductUnitController.php:48
* @route '/products/{product}/units'
*/
const storeForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProductUnitController::store
* @see app/Http/Controllers/ProductUnitController.php:48
* @route '/products/{product}/units'
*/
storeForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ProductUnitController::update
* @see app/Http/Controllers/ProductUnitController.php:78
* @route '/products/{product}/units/{productUnit}'
*/
export const update = (args: { product: number | { id: number }, productUnit: number | { id: number } } | [product: number | { id: number }, productUnit: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/products/{product}/units/{productUnit}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProductUnitController::update
* @see app/Http/Controllers/ProductUnitController.php:78
* @route '/products/{product}/units/{productUnit}'
*/
update.url = (args: { product: number | { id: number }, productUnit: number | { id: number } } | [product: number | { id: number }, productUnit: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            product: args[0],
            productUnit: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: typeof args.product === 'object'
        ? args.product.id
        : args.product,
        productUnit: typeof args.productUnit === 'object'
        ? args.productUnit.id
        : args.productUnit,
    }

    return update.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace('{productUnit}', parsedArgs.productUnit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductUnitController::update
* @see app/Http/Controllers/ProductUnitController.php:78
* @route '/products/{product}/units/{productUnit}'
*/
update.patch = (args: { product: number | { id: number }, productUnit: number | { id: number } } | [product: number | { id: number }, productUnit: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ProductUnitController::update
* @see app/Http/Controllers/ProductUnitController.php:78
* @route '/products/{product}/units/{productUnit}'
*/
const updateForm = (args: { product: number | { id: number }, productUnit: number | { id: number } } | [product: number | { id: number }, productUnit: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProductUnitController::update
* @see app/Http/Controllers/ProductUnitController.php:78
* @route '/products/{product}/units/{productUnit}'
*/
updateForm.patch = (args: { product: number | { id: number }, productUnit: number | { id: number } } | [product: number | { id: number }, productUnit: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\ProductUnitController::destroy
* @see app/Http/Controllers/ProductUnitController.php:102
* @route '/products/{product}/units/{productUnit}'
*/
export const destroy = (args: { product: number | { id: number }, productUnit: number | { id: number } } | [product: number | { id: number }, productUnit: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/products/{product}/units/{productUnit}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductUnitController::destroy
* @see app/Http/Controllers/ProductUnitController.php:102
* @route '/products/{product}/units/{productUnit}'
*/
destroy.url = (args: { product: number | { id: number }, productUnit: number | { id: number } } | [product: number | { id: number }, productUnit: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            product: args[0],
            productUnit: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: typeof args.product === 'object'
        ? args.product.id
        : args.product,
        productUnit: typeof args.productUnit === 'object'
        ? args.productUnit.id
        : args.productUnit,
    }

    return destroy.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace('{productUnit}', parsedArgs.productUnit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductUnitController::destroy
* @see app/Http/Controllers/ProductUnitController.php:102
* @route '/products/{product}/units/{productUnit}'
*/
destroy.delete = (args: { product: number | { id: number }, productUnit: number | { id: number } } | [product: number | { id: number }, productUnit: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ProductUnitController::destroy
* @see app/Http/Controllers/ProductUnitController.php:102
* @route '/products/{product}/units/{productUnit}'
*/
const destroyForm = (args: { product: number | { id: number }, productUnit: number | { id: number } } | [product: number | { id: number }, productUnit: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProductUnitController::destroy
* @see app/Http/Controllers/ProductUnitController.php:102
* @route '/products/{product}/units/{productUnit}'
*/
destroyForm.delete = (args: { product: number | { id: number }, productUnit: number | { id: number } } | [product: number | { id: number }, productUnit: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const units = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default units