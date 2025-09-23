import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\WarehouseController::index
 * @see app/Http/Controllers/WarehouseController.php:19
 * @route '/warehouses'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/warehouses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WarehouseController::index
 * @see app/Http/Controllers/WarehouseController.php:19
 * @route '/warehouses'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarehouseController::index
 * @see app/Http/Controllers/WarehouseController.php:19
 * @route '/warehouses'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WarehouseController::index
 * @see app/Http/Controllers/WarehouseController.php:19
 * @route '/warehouses'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WarehouseController::index
 * @see app/Http/Controllers/WarehouseController.php:19
 * @route '/warehouses'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WarehouseController::index
 * @see app/Http/Controllers/WarehouseController.php:19
 * @route '/warehouses'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WarehouseController::index
 * @see app/Http/Controllers/WarehouseController.php:19
 * @route '/warehouses'
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
* @see \App\Http\Controllers\WarehouseController::create
 * @see app/Http/Controllers/WarehouseController.php:51
 * @route '/warehouses/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/warehouses/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WarehouseController::create
 * @see app/Http/Controllers/WarehouseController.php:51
 * @route '/warehouses/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarehouseController::create
 * @see app/Http/Controllers/WarehouseController.php:51
 * @route '/warehouses/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WarehouseController::create
 * @see app/Http/Controllers/WarehouseController.php:51
 * @route '/warehouses/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WarehouseController::create
 * @see app/Http/Controllers/WarehouseController.php:51
 * @route '/warehouses/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WarehouseController::create
 * @see app/Http/Controllers/WarehouseController.php:51
 * @route '/warehouses/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WarehouseController::create
 * @see app/Http/Controllers/WarehouseController.php:51
 * @route '/warehouses/create'
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
* @see \App\Http\Controllers\WarehouseController::store
 * @see app/Http/Controllers/WarehouseController.php:59
 * @route '/warehouses'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/warehouses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WarehouseController::store
 * @see app/Http/Controllers/WarehouseController.php:59
 * @route '/warehouses'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarehouseController::store
 * @see app/Http/Controllers/WarehouseController.php:59
 * @route '/warehouses'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WarehouseController::store
 * @see app/Http/Controllers/WarehouseController.php:59
 * @route '/warehouses'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WarehouseController::store
 * @see app/Http/Controllers/WarehouseController.php:59
 * @route '/warehouses'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\WarehouseController::show
 * @see app/Http/Controllers/WarehouseController.php:68
 * @route '/warehouses/{warehouse}'
 */
export const show = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/warehouses/{warehouse}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WarehouseController::show
 * @see app/Http/Controllers/WarehouseController.php:68
 * @route '/warehouses/{warehouse}'
 */
show.url = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warehouse: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { warehouse: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    warehouse: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        warehouse: typeof args.warehouse === 'object'
                ? args.warehouse.id
                : args.warehouse,
                }

    return show.definition.url
            .replace('{warehouse}', parsedArgs.warehouse.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarehouseController::show
 * @see app/Http/Controllers/WarehouseController.php:68
 * @route '/warehouses/{warehouse}'
 */
show.get = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WarehouseController::show
 * @see app/Http/Controllers/WarehouseController.php:68
 * @route '/warehouses/{warehouse}'
 */
show.head = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WarehouseController::show
 * @see app/Http/Controllers/WarehouseController.php:68
 * @route '/warehouses/{warehouse}'
 */
    const showForm = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WarehouseController::show
 * @see app/Http/Controllers/WarehouseController.php:68
 * @route '/warehouses/{warehouse}'
 */
        showForm.get = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WarehouseController::show
 * @see app/Http/Controllers/WarehouseController.php:68
 * @route '/warehouses/{warehouse}'
 */
        showForm.head = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\WarehouseController::edit
 * @see app/Http/Controllers/WarehouseController.php:76
 * @route '/warehouses/{warehouse}/edit'
 */
export const edit = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/warehouses/{warehouse}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WarehouseController::edit
 * @see app/Http/Controllers/WarehouseController.php:76
 * @route '/warehouses/{warehouse}/edit'
 */
edit.url = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warehouse: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { warehouse: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    warehouse: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        warehouse: typeof args.warehouse === 'object'
                ? args.warehouse.id
                : args.warehouse,
                }

    return edit.definition.url
            .replace('{warehouse}', parsedArgs.warehouse.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarehouseController::edit
 * @see app/Http/Controllers/WarehouseController.php:76
 * @route '/warehouses/{warehouse}/edit'
 */
edit.get = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WarehouseController::edit
 * @see app/Http/Controllers/WarehouseController.php:76
 * @route '/warehouses/{warehouse}/edit'
 */
edit.head = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WarehouseController::edit
 * @see app/Http/Controllers/WarehouseController.php:76
 * @route '/warehouses/{warehouse}/edit'
 */
    const editForm = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WarehouseController::edit
 * @see app/Http/Controllers/WarehouseController.php:76
 * @route '/warehouses/{warehouse}/edit'
 */
        editForm.get = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WarehouseController::edit
 * @see app/Http/Controllers/WarehouseController.php:76
 * @route '/warehouses/{warehouse}/edit'
 */
        editForm.head = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\WarehouseController::update
 * @see app/Http/Controllers/WarehouseController.php:92
 * @route '/warehouses/{warehouse}'
 */
export const update = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/warehouses/{warehouse}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\WarehouseController::update
 * @see app/Http/Controllers/WarehouseController.php:92
 * @route '/warehouses/{warehouse}'
 */
update.url = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warehouse: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { warehouse: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    warehouse: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        warehouse: typeof args.warehouse === 'object'
                ? args.warehouse.id
                : args.warehouse,
                }

    return update.definition.url
            .replace('{warehouse}', parsedArgs.warehouse.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarehouseController::update
 * @see app/Http/Controllers/WarehouseController.php:92
 * @route '/warehouses/{warehouse}'
 */
update.put = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\WarehouseController::update
 * @see app/Http/Controllers/WarehouseController.php:92
 * @route '/warehouses/{warehouse}'
 */
update.patch = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\WarehouseController::update
 * @see app/Http/Controllers/WarehouseController.php:92
 * @route '/warehouses/{warehouse}'
 */
    const updateForm = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WarehouseController::update
 * @see app/Http/Controllers/WarehouseController.php:92
 * @route '/warehouses/{warehouse}'
 */
        updateForm.put = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\WarehouseController::update
 * @see app/Http/Controllers/WarehouseController.php:92
 * @route '/warehouses/{warehouse}'
 */
        updateForm.patch = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\WarehouseController::destroy
 * @see app/Http/Controllers/WarehouseController.php:101
 * @route '/warehouses/{warehouse}'
 */
export const destroy = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/warehouses/{warehouse}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WarehouseController::destroy
 * @see app/Http/Controllers/WarehouseController.php:101
 * @route '/warehouses/{warehouse}'
 */
destroy.url = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warehouse: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { warehouse: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    warehouse: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        warehouse: typeof args.warehouse === 'object'
                ? args.warehouse.id
                : args.warehouse,
                }

    return destroy.definition.url
            .replace('{warehouse}', parsedArgs.warehouse.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarehouseController::destroy
 * @see app/Http/Controllers/WarehouseController.php:101
 * @route '/warehouses/{warehouse}'
 */
destroy.delete = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\WarehouseController::destroy
 * @see app/Http/Controllers/WarehouseController.php:101
 * @route '/warehouses/{warehouse}'
 */
    const destroyForm = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WarehouseController::destroy
 * @see app/Http/Controllers/WarehouseController.php:101
 * @route '/warehouses/{warehouse}'
 */
        destroyForm.delete = (args: { warehouse: number | { id: number } } | [warehouse: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const warehouses = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default warehouses