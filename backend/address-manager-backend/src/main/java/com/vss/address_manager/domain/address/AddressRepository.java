package com.vss.address_manager.domain.address;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address,Long> {

    Optional<Address> findByUserIdAndIsMainTrue(Long id);

    List<Address> findByUserId(Long userId);
}
