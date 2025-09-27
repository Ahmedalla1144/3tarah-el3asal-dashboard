import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\QzController::sign
 * @see app/Http/Controllers/QzController.php:11
 * @route '/qz/sign'
 */
export const sign = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sign.url(options),
    method: 'post',
})

sign.definition = {
    methods: ["post"],
    url: '/qz/sign',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\QzController::sign
 * @see app/Http/Controllers/QzController.php:11
 * @route '/qz/sign'
 */
sign.url = (options?: RouteQueryOptions) => {
    return sign.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\QzController::sign
 * @see app/Http/Controllers/QzController.php:11
 * @route '/qz/sign'
 */
sign.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sign.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\QzController::sign
 * @see app/Http/Controllers/QzController.php:11
 * @route '/qz/sign'
 */
    const signForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sign.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\QzController::sign
 * @see app/Http/Controllers/QzController.php:11
 * @route '/qz/sign'
 */
        signForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sign.url(options),
            method: 'post',
        })
    
    sign.form = signForm
/**
* @see \App\Http\Controllers\QzController::hash
 * @see app/Http/Controllers/QzController.php:34
 * @route '/qz/hash'
 */
export const hash = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hash.url(options),
    method: 'post',
})

hash.definition = {
    methods: ["post"],
    url: '/qz/hash',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\QzController::hash
 * @see app/Http/Controllers/QzController.php:34
 * @route '/qz/hash'
 */
hash.url = (options?: RouteQueryOptions) => {
    return hash.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\QzController::hash
 * @see app/Http/Controllers/QzController.php:34
 * @route '/qz/hash'
 */
hash.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hash.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\QzController::hash
 * @see app/Http/Controllers/QzController.php:34
 * @route '/qz/hash'
 */
    const hashForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: hash.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\QzController::hash
 * @see app/Http/Controllers/QzController.php:34
 * @route '/qz/hash'
 */
        hashForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: hash.url(options),
            method: 'post',
        })
    
    hash.form = hashForm
/**
 * @see routes/web.php:57
 * @route '/qz-test'
 */
export const test = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: test.url(options),
    method: 'get',
})

test.definition = {
    methods: ["get","head"],
    url: '/qz-test',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:57
 * @route '/qz-test'
 */
test.url = (options?: RouteQueryOptions) => {
    return test.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:57
 * @route '/qz-test'
 */
test.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: test.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:57
 * @route '/qz-test'
 */
test.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: test.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:57
 * @route '/qz-test'
 */
    const testForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: test.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:57
 * @route '/qz-test'
 */
        testForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: test.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:57
 * @route '/qz-test'
 */
        testForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: test.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    test.form = testForm
const qz = {
    sign: Object.assign(sign, sign),
hash: Object.assign(hash, hash),
test: Object.assign(test, test),
}

export default qz