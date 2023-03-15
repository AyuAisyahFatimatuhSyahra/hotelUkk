import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { FaFolderPlus } from 'react-icons/fa'

import Sidebar from '@/components/common/SidebarAdmin'
import SidebarReceptionist from '@/components/common/SidebarReceptionist'
import axios from '@/lib/axios'
import { headerConfig } from '@/lib/headerConfig'
import AllRoomTypeSection from './Components/RoomType'

function ContainerRoomType() {
    const [data, setData] = useState({});
    const [dataLogin, setDataLogin] = useState({});

    useEffect(() => {
        const getData = async () => {
            await axios
                .get('/tipe_kamar', headerConfig())
                .then((res) => setData(res.data.data))
                .catch((err) => console.log(err));
        };

        Promise.all([getData()]);
    }, []);

    useEffect(() => {
        if (localStorage.getItem('admin')) {
            setDataLogin(JSON.parse(localStorage.getItem('admin') || '{}'))
        }

        if (localStorage.getItem('resepsionis')) {
            setDataLogin(JSON.parse(localStorage.getItem('resepsionis') || '{}'))
        }
    }, [])

    return (
        <>
            {dataLogin?.role === 'admin' && <Sidebar/>}

            {dataLogin?.role === 'resepsionis' && <SidebarReceptionist />}
            <main>
                <div>
                    <section className="bg-white dark:bg-white md:ml-64 min-h-screen">
                        <div className="p-10 rounded-md w-full">
                            <div className="flex flex-wrap items-center justify-between pb-6">
                                <div>
                                    <h2 className="text-black text-2xl font-semibold">
                                        Tipe Kamar
                                    </h2>
                                </div>
                                <div className="lg:ml-20 ml-10 space-x-8">
                                    <Link href="/admin/room-type/add" legacyBehavior>
                                        <a className="flex items-center justify-center bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">
                                            <FaFolderPlus className="mr-2" /> Tambah Tipe Kamar
                                        </a>
                                    </Link>
                                    <AllRoomTypeSection />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}

export default ContainerRoomType