import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { View, Pressable, Modal, FlatList, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Typography } from "@/src/components/Typography";
import Button from "@/src/components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";

const MONTHS = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => (currentYear - 4 + i).toString());

const OptionPicker = ({
    visible,
    data,
    onSelect,
    onClose,
    title,
}: {
    visible: boolean;
    data: string[];
    onSelect: (item: string) => void;
    onClose: () => void;
    title: string;
}) => {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable
                className="flex-1 bg-black/50 justify-center items-center p-6"
                onPress={onClose}>
                <View className="bg-white w-full max-h-[50%] rounded-2xl p-4 shadow-lg">
                    <Typography
                        variant="h2"
                        weight="semibold"
                        className="text-left mb-4 border-b border-gray-100 pb-2">
                        Pilih {title}
                    </Typography>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="p-4 border-b border-gray-100 active:bg-gray-50 rounded-lg"
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}>
                                <Typography
                                    variant="body"
                                    weight="semibold"
                                    className="text-center text-gray-800">
                                    {item}
                                </Typography>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Pressable>
        </Modal>
    );
};

interface RangeSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectRange: (startDate: Date, endDate: Date) => void;
}

const RangeSelectionModal = ({ visible, onClose, onSelectRange }: RangeSelectionModalProps) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["75%"], []);

    // Waktu Awal
    const [startDay, setStartDay] = useState<string>("1");
    const [startMonth, setStartMonth] = useState<string>(MONTHS[0] ?? "Januari");
    const [startYear, setStartYear] = useState<string>(currentYear.toString());

    // Waktu Akhir
    const [endDay, setEndDay] = useState<string>(new Date().getDate().toString());
    const [endMonth, setEndMonth] = useState<string>(MONTHS[new Date().getMonth()] ?? "Januari");
    const [endYear, setEndYear] = useState<string>(currentYear.toString());

    const [pickerType, setPickerType] = useState<
        "startDay" | "startMonth" | "startYear" | "endDay" | "endMonth" | "endYear" | null
    >(null);

    useEffect(() => {
        if (visible) bottomSheetModalRef.current?.present();
        else bottomSheetModalRef.current?.dismiss();
    }, [visible]);
    const handleSheetChanges = useCallback(
        (index: number) => {
            if (index === -1) onClose();
        },
        [onClose]
    );

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    const getDaysInMonth = (month: string, year: string) => {
        const monthIndex = MONTHS.indexOf(month);
        const yearInt = parseInt(year);
        const daysCount = new Date(yearInt, monthIndex + 1, 0).getDate();
        return Array.from({ length: daysCount }, (_, i) => (i + 1).toString());
    };

    const handleConfirm = () => {
        const startMonthIndex = MONTHS.indexOf(startMonth);
        const startDateObj = new Date(parseInt(startYear), startMonthIndex, parseInt(startDay));

        const endMonthIndex = MONTHS.indexOf(endMonth);
        const endDateObj = new Date(parseInt(endYear), endMonthIndex, parseInt(endDay));

        onSelectRange(startDateObj, endDateObj);
        bottomSheetModalRef.current?.dismiss();
    };

    return (
        <>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                backdropComponent={renderBackdrop}
                enablePanDownToClose={true}
                backgroundStyle={{ borderRadius: 24 }}>
                <BottomSheetView style={{ flex: 1, padding: 24, marginBottom: 16 }}>
                    <Typography variant="h3" weight="semibold" className="text-center mb-4">
                        Pilih Waktu Awal
                    </Typography>
                    <View className="flex-row justify-between mb-6 gap-2">
                        <Pressable
                            className="flex-1 flex-row items-center justify-between border border-gray-300 rounded-xl p-3 active:bg-gray-50 active:border-green-500"
                            onPress={() => setPickerType("startDay")}>
                            <Typography variant="body" weight="semibold" className="text-gray-700">
                                {startDay}
                            </Typography>
                            <Ionicons name="chevron-down" size={16} color="gray" />
                        </Pressable>

                        <Pressable
                            className="flex-[1.5] flex-row items-center justify-between border border-gray-300 rounded-xl p-3 active:bg-gray-50 active:border-green-500"
                            onPress={() => setPickerType("startMonth")}>
                            <Typography
                                variant="body"
                                weight="semibold"
                                className="text-gray-700"
                                numberOfLines={1}>
                                {startMonth}
                            </Typography>
                            <Ionicons name="chevron-down" size={16} color="gray" />
                        </Pressable>

                        <Pressable
                            className="flex-1 flex-row items-center justify-between border border-gray-300 rounded-xl p-3 active:bg-gray-50 active:border-green-500"
                            onPress={() => setPickerType("startYear")}>
                            <Typography variant="body" weight="semibold" className="text-gray-700">
                                {startYear}
                            </Typography>
                            <Ionicons name="chevron-down" size={16} color="gray" />
                        </Pressable>
                    </View>

                    <View className="border-b border-gray-200 mb-6" />

                    {/* Waktu Akhir Section */}
                    <Typography variant="h3" weight="semibold" className="text-center mb-4">
                        Pilih Waktu Akhir
                    </Typography>
                    <View className="flex-row justify-between mb-8 gap-2">
                        <Pressable
                            className="flex-1 flex-row items-center justify-between border border-gray-300 rounded-xl p-3 active:bg-gray-50 active:border-green-500"
                            onPress={() => setPickerType("endDay")}>
                            <Typography variant="body" weight="semibold" className="text-gray-700">
                                {endDay}
                            </Typography>
                            <Ionicons name="chevron-down" size={16} color="gray" />
                        </Pressable>

                        <Pressable
                            className="flex-[1.5] flex-row items-center justify-between border border-gray-300 rounded-xl p-3 active:bg-gray-50 active:border-green-500"
                            onPress={() => setPickerType("endMonth")}>
                            <Typography
                                variant="body"
                                weight="semibold"
                                className="text-gray-700"
                                numberOfLines={1}>
                                {endMonth}
                            </Typography>
                            <Ionicons name="chevron-down" size={16} color="gray" />
                        </Pressable>

                        <Pressable
                            className="flex-1 flex-row items-center justify-between border border-gray-300 rounded-xl p-3 active:bg-gray-50 active:border-green-500"
                            onPress={() => setPickerType("endYear")}>
                            <Typography variant="body" weight="semibold" className="text-gray-700">
                                {endYear}
                            </Typography>
                            <Ionicons name="chevron-down" size={16} color="gray" />
                        </Pressable>
                    </View>

                    <Button
                        label="Konfirmasi"
                        variant="primary"
                        onPress={handleConfirm}
                        textVariant="h3"
                        isIcon={false}
                    />
                </BottomSheetView>
            </BottomSheetModal>
            <OptionPicker
                visible={pickerType === "startDay"}
                title="Tanggal Awal"
                data={getDaysInMonth(startMonth, startYear)}
                onSelect={setStartDay}
                onClose={() => setPickerType(null)}
            />

            <OptionPicker
                visible={pickerType === "startMonth"}
                title="Bulan Awal"
                data={MONTHS}
                onSelect={(m) => {
                    setStartMonth(m);
                    setStartDay("1");
                }}
                onClose={() => setPickerType(null)}
            />

            <OptionPicker
                visible={pickerType === "startYear"}
                title="Tahun Awal"
                data={YEARS}
                onSelect={setStartYear}
                onClose={() => setPickerType(null)}
            />

            <OptionPicker
                visible={pickerType === "endDay"}
                title="Tanggal Akhir"
                data={getDaysInMonth(endMonth, endYear)}
                onSelect={setEndDay}
                onClose={() => setPickerType(null)}
            />

            <OptionPicker
                visible={pickerType === "endMonth"}
                title="Bulan Akhir"
                data={MONTHS}
                onSelect={(m) => {
                    setEndMonth(m);
                    setEndDay("1");
                }}
                onClose={() => setPickerType(null)}
            />

            <OptionPicker
                visible={pickerType === "endYear"}
                title="Tahun Akhir"
                data={YEARS}
                onSelect={setEndYear}
                onClose={() => setPickerType(null)}
            />
        </>
    );
};

export default RangeSelectionModal;
