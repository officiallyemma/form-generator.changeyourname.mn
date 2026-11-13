<?php
/**
 * Plugin Name: Name Change Form Generator by Emma Zimbinski (changeyourname.mn)
 */

defined('ABSPATH') || exit;


/*
 * --------------------------------------------------------------------------
 * Form generator shortcode
 * --------------------------------------------------------------------------
 */

add_shortcode('name-change-form-generator', function () {
    $url = plugins_url('resources/index.html?state=colorado', __FILE__);

    return sprintf(
        '<iframe
            src="%s"
            style="width: 100%%;height: 800px;border: 2px solid #252525;display: block;border-radius: 40px;box-shadow: 9px 6px 1px #252525;"
            sandbox="allow-scripts allow-downloads allow-popups allow-same-origin allow-popups-to-escape-sandbox"
            title="Name Change Form Generator"
        ></iframe>',
        esc_url($url)
    );
});


/*
 * --------------------------------------------------------------------------
 * Database
 * --------------------------------------------------------------------------
 */

// Reusable textual reference to our database table.
function counter_api_table() {
    global $wpdb;

    return $wpdb->prefix . 'name_change_form_generator_counter';
}


// On plugin activation, create the database table if needed.
register_activation_hook(__FILE__, function () {
    global $wpdb;

    $table = counter_api_table();

    $charset_collate = $wpdb->get_charset_collate();

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';

    dbDelta("
        CREATE TABLE {$table} (
            id bigint(20) unsigned NOT NULL,
            count bigint(20) unsigned NOT NULL DEFAULT 0,
            PRIMARY KEY (id)
        ) {$charset_collate};
    ");

    // Create the counter if it doesn't exist yet.
    $wpdb->query(
        $wpdb->prepare(
            "INSERT IGNORE INTO {$table} (id, count)
             VALUES (%d, %d)",
            1,
            0
        )
    );
});


/*
 * --------------------------------------------------------------------------
 * Rewrite rules
 * --------------------------------------------------------------------------
 */

function counter_api_register_rewrite_rules() {
    add_rewrite_rule(
        '^counter/?$',
        'index.php?counter_api_endpoint=counter',
        'top'
    );

    add_rewrite_rule(
        '^increment/?$',
        'index.php?counter_api_endpoint=increment',
        'top'
    );
}

add_action('init', 'counter_api_register_rewrite_rules');


/*
 * Tell WordPress that counter_api_endpoint is a valid query variable.
 */

add_filter('query_vars', function ($vars) {
    $vars[] = 'counter_api_endpoint';

    return $vars;
});


/*
 * Rewrite rules need to be flushed after activation/deactivation.
 */

register_activation_hook(__FILE__, function () {
    counter_api_register_rewrite_rules();

    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, function () {
    flush_rewrite_rules();
});


/*
 * --------------------------------------------------------------------------
 * Endpoint handling
 * --------------------------------------------------------------------------
 */

add_action('template_redirect', function () {

    $endpoint = get_query_var('counter_api_endpoint');

    if (!$endpoint) {
        return;
    }

    // These endpoints return JSON and should never render a WordPress page.
    nocache_headers();

    header('Content-Type: application/json; charset=utf-8');

    if ($endpoint === 'counter') {
        counter_api_get();
        exit;
    }

    if ($endpoint === 'increment') {
        counter_api_increment();
        exit;
    }

    status_header(404);

    echo wp_json_encode([
        'error' => 'not_found',
    ]);

    exit;
});


/*
 * --------------------------------------------------------------------------
 * GET /counter
 * --------------------------------------------------------------------------
 */

function counter_api_get() {
    global $wpdb;

    $table = counter_api_table();

    $count = $wpdb->get_var(
        "SELECT count
         FROM {$table}
         WHERE id = 1"
    );

    if ($count === null) {
        status_header(500);

        echo wp_json_encode([
            'error' => 'counter_not_initialized',
        ]);

        return;
    }


    echo $count;
    // echo wp_json_encode([
    //     'count' => (int) $count,
    // ]);
}


/*
 * --------------------------------------------------------------------------
 * POST /increment
 * --------------------------------------------------------------------------
 */

function counter_api_increment() {
    global $wpdb;

    // Only POST is allowed.
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        status_header(405);

        header('Allow: POST');

        echo wp_json_encode([
            'error' => 'method_not_allowed',
        ]);

        return;
    }

    $table = counter_api_table();

    /*
     * Atomic increment.
     *
     * Do NOT read the count into PHP and then write it back.
     *
     *     SELECT count
     *     count++
     *     UPDATE count
     *
     * would allow concurrent requests to overwrite each other.
     *
     * MySQL performs this UPDATE atomically.
     */
    $updated = $wpdb->query(
        "UPDATE {$table}
         SET count = count + 1
         WHERE id = 1"
    );

    if ($updated !== 1) {
        status_header(500);

        echo wp_json_encode([
            'error' => 'counter_update_failed',
        ]);

        return;
    }

    /*
     * Return the new value.
     */
    $count = $wpdb->get_var(
        "SELECT count
         FROM {$table}
         WHERE id = 1"
    );


    echo $count;
    // echo wp_json_encode([
    //     'count' => (int) $count,
    // ]);
}
