import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:62
 * @route '/test-print'
 */
export const print = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/test-print',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:62
 * @route '/test-print'
 */
print.url = (options?: RouteQueryOptions) => {
    return print.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:62
 * @route '/test-print'
 */
print.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:62
 * @route '/test-print'
 */
print.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:62
 * @route '/test-print'
 */
    const printForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: print.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:62
 * @route '/test-print'
 */
        printForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: print.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:62
 * @route '/test-print'
 */
        printForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: print.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    print.form = printForm
const test = {
    print: Object.assign(print, print),
}

export default test