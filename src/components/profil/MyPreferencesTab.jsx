const MyPreferencesTab = () => {
    return (
        <div>
            <div className='mt-10'>
                <p className='font-bold mb-4'>Si vous êtes simple membre</p>
                <div className='w-full bg-gray-100 p-4 grid grid-cols-1 space-y-2'>
                    <label htmlFor="1">
                        <input type='checkbox' name='1' className='mr-3 scale-150' />
                        Être informé par email lorsqu’un nouveau concours est publié
                    </label>
                    <label htmlFor="2">
                        <input type='checkbox' name='2' className='mr-3 scale-150' />
                        Être informé par email lorsqu’un concours entre en phase de vote
                    </label>
                    <label htmlFor="3">
                        <input type='checkbox' name='3' className='mr-3 scale-150' />
                        Être informé par email 48h avant la date de fin des votes d’un concours
                    </label>
                    <label htmlFor="4">
                        <input type='checkbox' name='4' className='mr-3 scale-150' />
                        Être informé par email lorsque les résultats d’un concours sont publiés
                    </label>
                    <label htmlFor="5">
                        <input type='checkbox' name='5' className='mr-3 scale-150' />
                        Être informé par email lorsqu’une nouvel article/actualité est publiée dans le blog
                    </label>
                </div>
            </div>
            <div className='mt-10'>
                <p className='font-bold mb-4'>Si vous êtes photographe</p>
                <div className='w-full bg-gray-100 p-4 grid grid-cols-1 space-y-2'>
                    <label htmlFor="6">
                        <input type='checkbox' name='6' className='mr-3 scale-150' />
                        Être informé lorsqu’un nouveau concours est publié et que mon profil satisfait les critères de participation
                    </label>
                    <label htmlFor="7">
                        <input type='checkbox' name='7' className='mr-3 scale-150' />
                        Être informé lorsqu’un concours entre en phase de soumission
                    </label>
                    <label htmlFor="8">
                        <input type='checkbox' name='8' className='mr-3 scale-150' />
                        Être informé 48h avant la date de fin des soumissions d’un concours
                    </label>
                </div>
            </div>
            <button className='bg-black text-white font-semibold px-14 py-5 rounded-full mt-10'>Mettre à jour</button>
        </div>
    );
}

export default MyPreferencesTab;
