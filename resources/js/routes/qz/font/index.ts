import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\QzController::base64
 * @see app/Http/Controllers/QzController.php:53
 * @route '/qz/font-base64'
 */
export const base64 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: base64.url(options),
    method: 'get',
})

base64.definition = {
    methods: ["get","head"],
    url: '/qz/font-base64',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\QzController::base64
 * @see app/Http/Controllers/QzController.php:53
 * @route '/qz/font-base64'
 */
base64.url = (options?: RouteQueryOptions) => {
    return base64.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\QzController::base64
 * @see app/Http/Controllers/QzController.php:53
 * @route '/qz/font-base64'
 */
base64.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: base64.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\QzController::base64
 * @see app/Http/Controllers/QzController.php:53
 * @route '/qz/font-base64'
 */
base64.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: base64.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\QzController::base64
 * @see app/Http/Controllers/QzController.php:53
 * @route '/qz/font-base64'
 */
    const base64Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: base64.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\QzController::base64
 * @see app/Http/Controllers/QzController.php:53
 * @route '/qz/font-base64'
 */
        base64Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: base64.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\QzController::base64
 * @see app/Http/Controllers/QzController.php:53
 * @route '/qz/font-base64'
 */
        base64Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: base64.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    base64.form = base64Form
const font = {
    base64: Object.assign(base64, base64),
}

export default font