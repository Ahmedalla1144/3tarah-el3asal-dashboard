import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import font from './font'
/**
* @see \App\Http\Controllers\QzController::cert
 * @see app/Http/Controllers/QzController.php:11
 * @route '/qz/cert'
 */
export const cert = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cert.url(options),
    method: 'get',
})

cert.definition = {
    methods: ["get","head"],
    url: '/qz/cert',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\QzController::cert
 * @see app/Http/Controllers/QzController.php:11
 * @route '/qz/cert'
 */
cert.url = (options?: RouteQueryOptions) => {
    return cert.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\QzController::cert
 * @see app/Http/Controllers/QzController.php:11
 * @route '/qz/cert'
 */
cert.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cert.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\QzController::cert
 * @see app/Http/Controllers/QzController.php:11
 * @route '/qz/cert'
 */
cert.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cert.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\QzController::cert
 * @see app/Http/Controllers/QzController.php:11
 * @route '/qz/cert'
 */
    const certForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cert.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\QzController::cert
 * @see app/Http/Controllers/QzController.php:11
 * @route '/qz/cert'
 */
        certForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cert.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\QzController::cert
 * @see app/Http/Controllers/QzController.php:11
 * @route '/qz/cert'
 */
        certForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cert.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cert.form = certForm
/**
* @see \App\Http\Controllers\QzController::sign
 * @see app/Http/Controllers/QzController.php:21
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
 * @see app/Http/Controllers/QzController.php:21
 * @route '/qz/sign'
 */
sign.url = (options?: RouteQueryOptions) => {
    return sign.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\QzController::sign
 * @see app/Http/Controllers/QzController.php:21
 * @route '/qz/sign'
 */
sign.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sign.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\QzController::sign
 * @see app/Http/Controllers/QzController.php:21
 * @route '/qz/sign'
 */
    const signForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sign.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\QzController::sign
 * @see app/Http/Controllers/QzController.php:21
 * @route '/qz/sign'
 */
        signForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sign.url(options),
            method: 'post',
        })
    
    sign.form = signForm
/**
* @see \App\Http\Controllers\QzController::hash
 * @see app/Http/Controllers/QzController.php:44
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
 * @see app/Http/Controllers/QzController.php:44
 * @route '/qz/hash'
 */
hash.url = (options?: RouteQueryOptions) => {
    return hash.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\QzController::hash
 * @see app/Http/Controllers/QzController.php:44
 * @route '/qz/hash'
 */
hash.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hash.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\QzController::hash
 * @see app/Http/Controllers/QzController.php:44
 * @route '/qz/hash'
 */
    const hashForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: hash.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\QzController::hash
 * @see app/Http/Controllers/QzController.php:44
 * @route '/qz/hash'
 */
        hashForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: hash.url(options),
            method: 'post',
        })
    
    hash.form = hashForm
const qz = {
    cert: Object.assign(cert, cert),
sign: Object.assign(sign, sign),
hash: Object.assign(hash, hash),
font: Object.assign(font, font),
}

export default qz