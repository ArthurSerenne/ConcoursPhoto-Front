import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import * as Yup from 'yup';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {format, parseISO} from 'date-fns';
import {toast} from "react-toastify";

const ContestForm = ({contest, updateContest}) => {

    const ageOptions = Array.from({length: 101}, (_, i) => ({value: i, label: `${i}`}));

    const loadThemes = (inputValue) => {
        return axios.get(process.env.REACT_APP_API_URL + '/themes.json', {
            params: {
                name: inputValue,
            }
        }).then((res) => {
            return res.data.map((theme) => ({
                value: theme.id,
                label: theme.name,
            }));
        });
    };

    const loadCategories = (inputValue) => {
        return axios.get(process.env.REACT_APP_API_URL + '/categories.json', {
            params: {
                name: inputValue,
            }
        }).then((res) => {
            return res.data.map((category) => ({
                value: category.id,
                label: category.name,
            }));
        });
    };

    const loadRegions = (inputValue) => {
        return axios.get(process.env.REACT_APP_API_URL + '/regions.json', {
            params: {
                name: inputValue,
            }
        }).then((res) => {
            return res.data.map((region) => ({
                value: region.id,
                label: region.name,
            }));
        });
    };

    const loadDepartments = (inputValue) => {
        return axios.get(process.env.REACT_APP_API_URL + '/departments.json', {
            params: {
                name: inputValue,
            }
        }).then((res) => {
            return res.data.map((department) => ({
                value: department.id,
                label: department.name,
            }));
        });
    };

    const initialValues = {
        name: contest.name || '',
        theme: contest.themes
            ? {value: contest.themes[0].id, label: contest.themes[0].name}
            : '',
        category: contest.categories
            ? {value: contest.categories[0].id, label: contest.categories[0].name}
            : '',
        dotation: '',
        ageMin: contest.ageMin
            ? {value: contest.ageMin, label: contest.ageMin.toString()}
            : '',
        ageMax: contest.ageMax
            ? {value: contest.ageMax, label: contest.ageMax.toString()}
            : '',
        prizesCount: contest.prizesCount || '',
        country: '',
        region: contest.regions
            ? {value: contest.regions[0].id, label: contest.regions[0].name}
            : '',
        department: contest.departments
            ? {value: contest.departments[0].id, label: contest.departments[0].name}
            : '',
        status: contest.status || '',
        activationDate: contest.activationDate
            ? format(parseISO(contest.activationDate), 'yyyy-MM-dd')
            : format(new Date(), 'yyyy-MM-dd'),
        publicationDate: contest.publicationDate
            ? format(parseISO(contest.publicationDate), 'yyyy-MM-dd')
            : format(new Date(), 'yyyy-MM-dd'),
        submissionStartDate: contest.submissionStartDate
            ? format(parseISO(contest.submissionStartDate), 'yyyy-MM-dd')
            : format(new Date(), 'yyyy-MM-dd'),
        submissionEndDate: contest.submissionEndDate
            ? format(parseISO(contest.submissionEndDate), 'yyyy-MM-dd')
            : format(new Date(), 'yyyy-MM-dd'),
        votingStartDate: contest.votingStartDate
            ? format(parseISO(contest.votingStartDate), 'yyyy-MM-dd')
            : format(new Date(), 'yyyy-MM-dd'),
        votingEndDate: contest.votingEndDate
            ? format(parseISO(contest.votingEndDate), 'yyyy-MM-dd')
            : format(new Date(), 'yyyy-MM-dd'),
        resultsDate: contest.resultsDate
            ? format(parseISO(contest.resultsDate), 'yyyy-MM-dd')
            : format(new Date(), 'yyyy-MM-dd'),
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Champ obligatoire'),
        theme: Yup.string().required('Champ obligatoire'),
        category: Yup.string().required('Champ obligatoire'),
        ageMin: Yup.number().required('Champ obligatoire'),
        ageMax: Yup.number().required('Champ obligatoire'),
        prizesCount: Yup.number().required('Champ obligatoire'),
        region: Yup.string(),
        department: Yup.string(),
        status: Yup.string(),
        activationDate: Yup.date(),
        publicationDate: Yup.date(),
        submissionStartDate: Yup.date(),
        submissionEndDate: Yup.date(),
        votingStartDate: Yup.date(),
        votingEndDate: Yup.date(),
        resultsDate: Yup.date(),
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit=""
        >
            {({isSubmitting, setFieldValue}) => (
                <Form className="flex flex-col md:flex-row">
                    <div className="w-full md:w-9/12">
                        <div className="flex flex-col mb-4">
                            <label htmlFor="name">Nom du concours *</label>
                            <Field
                                name="name"
                                type="text"
                                className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 p-1"
                            />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="flex flex-row flex-wrap">
                            <div className="w-full md:w-1/3 mb-4 md:mb-0 md:pr-4">
                                <div className="flex flex-col">
                                    <label htmlFor="theme">Thème du concours*</label>
                                    <Field name="theme">
                                        {({field, form}) => (
                                            <AsyncSelect
                                                {...field}
                                                className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 p-1"
                                                loadOptions={loadThemes}
                                                onChange={(option) =>
                                                    form.setFieldValue(field.name, option)
                                                }
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="theme"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="ageMin">
                                        Âge minimum requis pour participer*
                                    </label>
                                    <Field name="ageMin">
                                        {({field, form}) => (
                                            <Select
                                                {...field}
                                                className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 p-1"
                                                options={ageOptions}
                                                onChange={(option) =>
                                                    form.setFieldValue(field.name, option)
                                                }
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="ageMin"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="country">Pays</label>
                                    <Field name="country">
                                        {({field, form}) => (
                                            <Select
                                                {...field}
                                                placeholder="Pays"
                                                className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 p-1"
                                                options={[{value: 'FR', label: 'France'}]}
                                                onChange={(option) =>
                                                    form.setFieldValue(field.name, option)
                                                }
                                            />
                                        )}
                                    </Field>
                                </div>
                            </div>
                            <div className="w-full md:w-1/3 mb-4 md:mb-0 md:pr-4">
                                <div className="flex flex-col">
                                    <label htmlFor="category">Catégorie*</label>
                                    <Field name="category">
                                        {({field, form}) => (
                                            <AsyncSelect
                                                {...field}
                                                className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 p-1"
                                                loadOptions={loadCategories}
                                                onChange={(option) =>
                                                    form.setFieldValue(field.name, option)
                                                }
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="category"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="ageMax">
                                        Âge maximum requis pour participer*
                                    </label>
                                    <Field name="ageMax">
                                        {({field, form}) => (
                                            <Select
                                                {...field}
                                                className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 p-1"
                                                options={ageOptions}
                                                onChange={(option) =>
                                                    form.setFieldValue(field.name, option)
                                                }
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="ageMax"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="region">Région</label>
                                    <Field name="region">
                                        {({field, form}) => (
                                            <AsyncSelect
                                                {...field}
                                                className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 p-1"
                                                loadOptions={loadRegions}
                                                onChange={(option) =>
                                                    form.setFieldValue(field.name, option)
                                                }
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="region"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-1/3">
                                <div className="flex flex-col">
                                    <label htmlFor="dotation">Dotation*</label>
                                    <Field name="dotation">
                                        {({field, form}) => (
                                            <Select
                                                {...field}
                                                placeholder="Dotation"
                                                className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 p-1"
                                                options={[{value: 'Presents', label: 'Cadeaux'}]}
                                                onChange={(option) =>
                                                    form.setFieldValue(field.name, option)
                                                }
                                            />
                                        )}
                                    </Field>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="prizesCount">Nombre de prix*</label>
                                    <Field
                                        name="prizesCount"
                                        type="text"
                                        className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 p-1"
                                    />
                                    <ErrorMessage
                                        name="prizesCount"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="department">Département</label>
                                    <Field name="department">
                                        {({field, form}) => (
                                            <AsyncSelect
                                                {...field}
                                                className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 p-1"
                                                loadOptions={loadDepartments}
                                                onChange={(option) =>
                                                    form.setFieldValue(field.name, option)
                                                }
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="department"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-3/12">
                        <div className="flex flex-col">
                            <Field type="radio" name="status" value="published"/>
                            <label htmlFor="status">Publié</label>
                            <Field type="radio" name="status" value="hidden"/>
                            <label htmlFor="status">Caché</label>
                            <ErrorMessage
                                name="status"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="activationDate">Date d'activation</label>
                            <Field
                                name="activationDate"
                                type="date"
                                className="mt-1 h-[43px] w-full rounded-md bg-gray-100 px-4 py-2"
                                disabled
                            />
                            <ErrorMessage
                                name="activationDate"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="publicationDate">Date de publication</label>
                            <Field
                                name="publicationDate"
                                type="date"
                                className="mt-1 h-[43px] w-full rounded-md bg-gray-100 px-4 py-2"
                            />
                            <ErrorMessage
                                name="publicationDate"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="submissionStartDate">
                                Date de début des soumissions
                            </label>
                            <Field
                                name="submissionStartDate"
                                type="date"
                                className="mt-1 h-[43px] w-full rounded-md bg-gray-100 px-4 py-2"
                            />
                            <ErrorMessage
                                name="submissionStartDate"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="submissionEndDate">
                                Date de fin des soumissions
                            </label>
                            <Field
                                name="submissionEndDate"
                                type="date"
                                className="mt-1 h-[43px] w-full rounded-md bg-gray-100 px-4 py-2"
                            />
                            <ErrorMessage
                                name="submissionEndDate"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="votingStartDate">Date de début des votes</label>
                            <Field
                                name="votingStartDate"
                                type="date"
                                className="mt-1 h-[43px] w-full rounded-md bg-gray-100 px-4 py-2"
                            />
                            <ErrorMessage
                                name="votingStartDate"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="votingEndDate">Date de fin des votes</label>
                            <Field
                                name="votingEndDate"
                                type="date"
                                className="mt-1 h-[43px] w-full rounded-md bg-gray-100 px-4 py-2"
                            />
                            <ErrorMessage
                                name="votingEndDate"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="resultsDate">
                                Date de publication des résultats
                            </label>
                            <Field
                                name="resultsDate"
                                type="date"
                                className="mt-1 h-[43px] w-full rounded-md bg-gray-100 px-4 py-2"
                            />
                            <ErrorMessage
                                name="resultsDate"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default ContestForm;
