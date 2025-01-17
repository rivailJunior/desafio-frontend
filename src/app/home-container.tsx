"use client";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { SearchPackage } from "@/assets";
import { Alert, AlertTitle, Box, Hidden, colors } from "@mui/material";
import { useRouter } from "next/navigation";
import { SelectFilter, MediaCard, ShipmentList } from "@/components";
import { getShipmentByPost } from "@/service";
import { Shipment } from "@/types/Shipment";
import { SHIPMENT_PAGE } from "@/config/route-utils";

const Subtitle = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color: any;
}) => (
  <Typography variant="subtitle2" component="div" color={color}>
    {children}
  </Typography>
);

const HomeContainer = () => {
  const router = useRouter();
  const [shipment, setShipment] = useState([]);
  const [isAlertOpen, setOpenAlert] = useState(false);

  const handleOnSubmitForm = async (filterType: string, value: string) => {
    try {
      const { data } = await getShipmentByPost(filterType, value);
      if (!data.length) {
        setOpenAlert(true);
      } else {
        setOpenAlert(false);
      }
      setShipment(data);
    } catch (err) {}
  };

  const handleOnClickItem = (shipment: Shipment) => {
    const URL = `/${SHIPMENT_PAGE}/${shipment.trackingNumber}`;
    router.push(URL);
  };
  return (
    <Grid
      container
      spacing={5}
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item xs={12} sm={12} md={6}>
        <Typography
          variant="h5"
          component="div"
          marginBottom={2}
          color="GrayText"
        >
          Rastreie seu pedido
        </Typography>
        <Box marginBottom={3} marginTop={2}>
          <Subtitle color="GrayText">Para pesquisar é simples</Subtitle>
          <Subtitle color={colors.blue[500]}>
            1 - Selecione <strong> Codigo</strong> ou <strong> CPF</strong>
          </Subtitle>
          <Subtitle color={colors.blue[500]}>
            2 - Digita o valor de acordo com o campo selecionado
          </Subtitle>
          <Subtitle color={colors.blue[500]}>3 - Clique em buscar</Subtitle>
        </Box>
        <SelectFilter onSubmit={handleOnSubmitForm} />
      </Grid>
      <Hidden smDown>
        <Grid item xs={12} sm={12} md={4}>
          <MediaCard img={SearchPackage} />
        </Grid>
      </Hidden>
      <Grid item xs={12} sm={12} md={12}>
        {shipment.length > 0 && (
          <ShipmentList shipments={shipment} onClick={handleOnClickItem} />
        )}

        {isAlertOpen && (
          <Alert
            severity="error"
            onClose={() => {
              setOpenAlert(false);
            }}
          >
            <AlertTitle>Ooooops!</AlertTitle>
            Nenhum pacote encontrado, verifique o{" "}
            <strong>filtro e o valor informado</strong> e tente novamente!
          </Alert>
        )}
      </Grid>
    </Grid>
  );
};

export { HomeContainer };
