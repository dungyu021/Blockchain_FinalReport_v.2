// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/HealthReport.sol";

contract HealthReportTest is Test {
    HealthReport public healthReport;
    address public owner;
    address public user1;
    address public user2;
    
    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        
        healthReport = new HealthReport(owner);
    }
    
    function testUploadReport() public {
        vm.prank(user1);
        
        healthReport.uploadReport(
            "PET001",
            "Blood Test",
            "Regular Health Check",
            "bafkreiexample123456789abcdef",
            "Pet blood test report with normal indicators"
        );
        
        HealthReport.Report memory report = healthReport.getReport(1);
        
        assertEq(report.reportId, 1);
        assertEq(report.petId, "PET001");
        assertEq(report.reportType, "Blood Test");
        assertEq(report.reportName, "Regular Health Check");
        assertEq(report.ipfsCID, "bafkreiexample123456789abcdef");
        assertEq(report.description, "Pet blood test report with normal indicators");
        assertEq(report.owner, user1);
        assertTrue(report.isValid);
    }
    
    function testGetUserReports() public {
        vm.prank(user1);
        healthReport.uploadReport(
            "PET001",
            "Blood Test",
            "Regular Health Check",
            "bafkreiexample123456789abcdef",
            "Blood test report"
        );
        
        vm.prank(user1);
        healthReport.uploadReport(
            "PET002",
            "Vaccination",
            "Annual Vaccine",
            "bafkreiexample987654321fedcba",
            "Vaccination record"
        );
        
        uint256[] memory userReports = healthReport.getUserReports(user1);
        assertEq(userReports.length, 2);
        assertEq(userReports[0], 1);
        assertEq(userReports[1], 2);
    }
    
    function testGetPetReports() public {
        vm.prank(user1);
        healthReport.uploadReport(
            "PET001",
            "Blood Test",
            "Regular Health Check",
            "bafkreiexample123456789abcdef",
            "Blood test report"
        );
        
        vm.prank(user2);
        healthReport.uploadReport(
            "PET001",
            "Vaccination",
            "Annual Vaccine",
            "bafkreiexample987654321fedcba",
            "Vaccination record"
        );
        
        uint256[] memory petReports = healthReport.getPetReports("PET001");
        assertEq(petReports.length, 2);
        assertEq(petReports[0], 1);
        assertEq(petReports[1], 2);
    }
    
    function testUpdateReportCID() public {
        vm.prank(user1);
        healthReport.uploadReport(
            "PET001",
            "Blood Test",
            "Regular Health Check",
            "bafkreiexample123456789abcdef",
            "Blood test report"
        );
        
        vm.prank(user1);
        healthReport.updateReportCID(1, "bafkreinewcid123456789abcdef");
        
        HealthReport.Report memory report = healthReport.getReport(1);
        assertEq(report.ipfsCID, "bafkreinewcid123456789abcdef");
    }
    
    function testInvalidateReport() public {
        vm.prank(user1);
        healthReport.uploadReport(
            "PET001",
            "Blood Test",
            "Regular Health Check",
            "bafkreiexample123456789abcdef",
            "Blood test report"
        );
        
        vm.prank(user1);
        healthReport.invalidateReport(1);
        
        HealthReport.Report memory report = healthReport.getReport(1);
        assertFalse(report.isValid);
    }
    
    function testRevertWhenUploadEmptyPetId() public {
        vm.prank(user1);
        vm.expectRevert("HealthReport: Pet ID cannot be empty");
        healthReport.uploadReport(
            "",
            "Blood Test",
            "Regular Health Check",
            "bafkreiexample123456789abcdef",
            "Blood test report"
        );
    }
    
    function testRevertWhenUpdateReportCIDNotOwner() public {
        vm.prank(user1);
        healthReport.uploadReport(
            "PET001",
            "Blood Test",
            "Regular Health Check",
            "bafkreiexample123456789abcdef",
            "Blood test report"
        );
        
        vm.prank(user2);
        vm.expectRevert("HealthReport: Not the owner");
        healthReport.updateReportCID(1, "bafkreinewcid123456789abcdef");
    }
    
    function testTotalReportCount() public {
        assertEq(healthReport.getTotalReportCount(), 0);
        
        vm.prank(user1);
        healthReport.uploadReport(
            "PET001",
            "Blood Test",
            "Regular Health Check",
            "bafkreiexample123456789abcdef",
            "Blood test report"
        );
        
        assertEq(healthReport.getTotalReportCount(), 1);
        
        vm.prank(user2);
        healthReport.uploadReport(
            "PET002",
            "Vaccination",
            "Annual Vaccine",
            "bafkreiexample987654321fedcba",
            "Vaccination record"
        );
        
        assertEq(healthReport.getTotalReportCount(), 2);
    }
    
    function testIsValidReport() public {
        vm.prank(user1);
        healthReport.uploadReport(
            "PET001",
            "Blood Test",
            "Regular Health Check",
            "bafkreiexample123456789abcdef",
            "Blood test report"
        );
        
        assertTrue(healthReport.isValidReport(1));
        assertFalse(healthReport.isValidReport(0));
        assertFalse(healthReport.isValidReport(999));
        
        vm.prank(user1);
        healthReport.invalidateReport(1);
        
        assertFalse(healthReport.isValidReport(1));
    }
} 