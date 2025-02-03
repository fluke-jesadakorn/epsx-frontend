import { createClient } from '@supabase/supabase-js';
import { defaultRoles } from '../constants/roles';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function seedRoles() {
  try {
    // Check if roles already exist
    const { data: existingRoles } = await supabase
      .from('roles')
      .select('id')
      .in('id', defaultRoles.map(role => role.id));

    if (existingRoles && existingRoles.length > 0) {
      console.log('Roles already exist in database');
      return;
    }

    // Insert default roles
    const { error } = await supabase
      .from('roles')
      .insert(defaultRoles.map(({ permissions, ...role }) => role));

    if (error) {
      throw error;
    }

    console.log('Successfully seeded default roles');
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
}

// Run the seed function
seedRoles();
