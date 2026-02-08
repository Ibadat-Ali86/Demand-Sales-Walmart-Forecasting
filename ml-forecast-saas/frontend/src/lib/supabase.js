import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️ Supabase environment variables not set. Using fallback for development.',
        '\nSet VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
}

// Create Supabase client
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        },
        realtime: {
            params: {
                eventsPerSecond: 10
            }
        }
    }
);

// =====================================================
// AUTH HELPERS
// =====================================================

/**
 * Sign up a new user with email and password
 */
export const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName
            }
        }
    });

    if (error) throw error;
    return data;
};

/**
 * Sign in with email and password
 */
export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw error;
    return data;
};

/**
 * Sign in with OAuth provider (Google, GitHub, etc.)
 */
export const signInWithProvider = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${window.location.origin}/dashboard`
        }
    });

    if (error) throw error;
    return data;
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

/**
 * Get the current session
 */
export const getSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
};

/**
 * Get the current user
 */
export const getUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
};

// =====================================================
// DATABASE HELPERS
// =====================================================

/**
 * Fetch stores (public data)
 */
export const fetchStores = async () => {
    const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('id');

    if (error) throw error;
    return data;
};

/**
 * Fetch user's forecasts
 */
export const fetchForecasts = async (limit = 100) => {
    const { data, error } = await supabase
        .from('forecasts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data;
};

/**
 * Create a new forecast
 */
export const createForecast = async (forecastData) => {
    const { data, error } = await supabase
        .from('forecasts')
        .insert(forecastData)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Fetch user's scenarios
 */
export const fetchScenarios = async () => {
    const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

/**
 * Create a new scenario
 */
export const createScenario = async (name, parameters) => {
    const { data, error } = await supabase
        .from('scenarios')
        .insert({
            name,
            parameters,
            results: {}
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Update a scenario
 */
export const updateScenario = async (id, updates) => {
    const { data, error } = await supabase
        .from('scenarios')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Delete a scenario
 */
export const deleteScenario = async (id) => {
    const { error } = await supabase
        .from('scenarios')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

/**
 * Fetch user's profile
 */
export const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

/**
 * Update user's profile
 */
export const updateProfile = async (updates) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('profiles')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// =====================================================
// REALTIME SUBSCRIPTIONS
// =====================================================

/**
 * Subscribe to new forecasts
 */
export const subscribeToForecasts = (callback) => {
    const channel = supabase
        .channel('forecasts-channel')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'forecasts'
            },
            (payload) => callback(payload.new)
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

/**
 * Subscribe to scenario updates
 */
export const subscribeToScenarios = (callback) => {
    const channel = supabase
        .channel('scenarios-channel')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'scenarios'
            },
            (payload) => callback(payload)
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

// =====================================================
// FILE STORAGE
// =====================================================

/**
 * Upload a file to storage
 */
export const uploadFile = async (bucket, path, file) => {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (error) throw error;
    return data;
};

/**
 * Get a signed URL for a private file
 */
export const getFileUrl = async (bucket, path) => {
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 3600); // 1 hour expiry

    if (error) throw error;
    return data.signedUrl;
};

/**
 * Delete a file from storage
 */
export const deleteFile = async (bucket, path) => {
    const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

    if (error) throw error;
};

export default supabase;
