import { packageApi } from "@/core/api/package.api";
import FieldBuilder from "@/core/components/field/FieldBuilder";
import { FieldType } from "@/core/components/field/FieldDisplay";
import FormBuilder from "@/core/components/form/FormBuilder";
import { NKFormType } from "@/core/components/form/NKForm";
import { Package } from "@/core/models/package";
import { NKConstant } from "@/core/NKConstant";
import { toastError } from "@/core/utils/api.helper";
import { createFileRoute } from "@tanstack/react-router";
import Joi from "joi";
import { useEffect, useState } from "react";

const Page = () => {
    const [packageId, setPackageId] = useState(1);
    const [res, setRes] = useState<Package | undefined>();

    useEffect(() => {
        const fetchPackageData = async () => {
            try {
                const packageData = await packageApi.getById(packageId);
                setRes(packageData);
            } catch (error) {
                console.error("Error fetching package data:", error);
            }
        };

        fetchPackageData();
    }, [packageId]);

    return (
        <div className="grid grid-cols-3 gap-3">
            <section className="col-span-1">
                <FormBuilder
                    apiAction={(data) => {

                    }}
                    title="Buy Package"
                    defaultValues={{
                        packageId: packageId
                    }}
                    schema={{
                        packageId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                    }}
                    fields={[
                        {
                            label: "Package",
                            name: "packageId",
                            type: NKFormType.SELECT_API_OPTION,
                            fieldProps: {
                                apiAction(value) {
                                    return packageApi.getEnumSelectOptions(value);
                                },
                            },
                            onChangeExtra: (value) => setPackageId(value),
                        }
                    ]}
                    onExtraErrorAction={() => { }}
                    onExtraSuccessAction={() => { }}
                />
            </section>
            <section className="col-span-2">
                <FieldBuilder
                    title="Detail Package"
                    record={res}
                    isPadding={false}
                    containerClassName="p-4"
                    fields={[
                        {
                            key: 'name',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'description',
                            title: 'Description',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'totalStudents',
                            title: 'Total Students',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'totalViolations',
                            title: 'Total Violations',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'price',
                            title: 'Price',
                            type: FieldType.NUMBER,
                        },
                    ]}
                />
            </section>
        </div >
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/packages/buy-packages')({
    component: Page,
});
