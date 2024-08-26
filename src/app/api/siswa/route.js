// app/api/siswa/route.js

import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Handler untuk GET request
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('searchTerm') || '';
  const filterGender = searchParams.get('filterGender');
  
  try {
    // Mengambil data user
    const { data: userData, error: userError } = await supabase
      .from('user')
      .select('noIndukSiswa, username, profile_picture_url');

    if (userError) throw new Error(userError.message);

    // Mengambil data siswa dan menerapkan filter jika ada
    let query = supabase.from('siswa').select('*');

    if (filterGender !== null) {
      query = query.eq('gender', parseInt(filterGender));
    }

    const { data: siswaData, error: siswaError } = await query;

    if (siswaError) throw new Error(siswaError.message);

    // Menggabungkan data user dan siswa
    const mergedData = siswaData
      .map((siswa) => {
        const user = userData.find(
          (user) => user.noIndukSiswa === siswa.noIndukSiswa
        );
        return {
          ...siswa,
          username: user ? user.username : 'Unknown',
          profile_picture_url: user ? user.profile_picture_url : null,
        };
      })
      // Penerapan pencarian berdasarkan username
      .filter((siswa) =>
        siswa.username.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return NextResponse.json(mergedData);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching data', error: error.message }, { status: 500 });
  }
}
